import RockObj from "./miner/rock_obj.js";
import Rock from "./miner/rock.js";
import randomArray from "random-array";
import * as THREE from "three";
import fs from "fs";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

function create_rock() {
    const rock_obj = new RockObj();
    rock_obj.seed = Math.round(randomArray(0, 999999999999).oned(1)[0]);
    rock_obj.scale = [1.0, 1.0, 1.8];
    return new Rock(rock_obj);
}

function create_obj_file(rock) {
    const scene = new THREE.Scene();

    const mesh = new THREE.Mesh(rock.geometry);
    scene.add(mesh);

    const exporter = new OBJExporter();
    return exporter.parse(scene);
}

function save(text, filename) {
    fs.writeFile(filename, text, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

const filename = "rock.obj";
const rock = create_rock();
const obj_file = create_obj_file(rock);
save(obj_file, filename);
