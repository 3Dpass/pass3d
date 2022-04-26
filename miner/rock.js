/**
 * @copyright https://github.com:Erkaman/gl-rock
 */

import vec3 from "gl-vec3";
import seedRandom from "seed-random";

import Perlin from "./Perlin.js";
import createSphere from "./sphere.js";
import scrape from "./scrape.js";

let adjacentVertices = null;

/*
Rock Mesh generation code.
 */
const Rock = function (rockObj) {
    const rock = {};

    rock.seed = rockObj.seed;
    rock.noiseScale = rockObj.meshNoiseScale.val;
    rock.noiseStrength = rockObj.meshNoiseStrength.val;
    rock.scrapeCount = rockObj.scrapeCount.val;
    rock.scrapeMinDist = rockObj.scrapeMinDist.val;
    rock.scrapeStrength = rockObj.scrapeStrength.val;
    rock.scrapeRadius = rockObj.scrapeRadius.val;
    rock.scale = rockObj.scale;

    const rand = seedRandom(rock.seed);

    const sphere = createSphere({ stacks: 20, slices: 20 });

    const positions = sphere.positions;
    const cells = sphere.cells;
    const normals = sphere.normals;

    if (!adjacentVertices) {
        // OPTIMIZATION: we are always using the same sphere as base for the rock,
        // so we only need to compute the adjacent positions once.
        const rockObj = scrape.getNeighbours(positions, cells);
        adjacentVertices = rockObj.adjacentVertices;
    }

    /*
     randomly generate positions at which to scrape.
      */
    const scrapeIndices = [];

    for (let i = 0; i < rock.scrapeCount; ++i) {
        let attempts = 0;

        // find random position which is not too close to the other positions.
        while (true) {
            const randIndex = Math.floor(positions.length * rand());
            const p = positions[randIndex];

            let tooClose = false;
            // check that it is not too close to the other vertices.
            for (let j = 0; j < scrapeIndices.length; ++j) {
                const q = positions[scrapeIndices[j]];

                if (vec3.distance(p, q) < rock.scrapeMinDist) {
                    tooClose = true;
                    break;
                }
            }
            ++attempts;

            // if we have done too many attempts, we let it pass regardless.
            // otherwise, we risk an endless loop.
            if (tooClose && attempts < 100) {
                continue;
            } else {
                scrapeIndices.push(randIndex);
                break;
            }
        }
    }

    // now we scrape at all the selected positions.
    for (let i = 0; i < scrapeIndices.length; ++i) {
        scrape.scrape(scrapeIndices[i], positions, cells, normals, adjacentVertices, rock.scrapeStrength, rock.scrapeRadius);
    }

    /*
    Finally, we apply a Perlin noise to slighty distort the mesh,
     and then we scale the mesh.
     */
    for (let i = 0; i < positions.length; ++i) {
        let p = positions[i];

        const perlin = new Perlin();
        const noise = rock.noiseStrength * perlin.noise(rock.noiseScale * p[0], rock.noiseScale * p[1], rock.noiseScale * p[2]);

        positions[i][0] += noise;
        positions[i][1] += noise;
        positions[i][2] += noise;

        positions[i][0] *= rock.scale[0];
        positions[i][1] *= rock.scale[1];
        positions[i][2] *= rock.scale[2];
    }

    rock.positions = positions;
    rock.cells = cells;

    return rock;
};

export default Rock;
