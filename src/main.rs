use std::fs::File;
use std::io::Read;
use structopt::StructOpt;

use p3d::p3d_process;
use p3d::AlgoType;

/// Search for a pattern in a file and display the lines that contain it.
#[derive(StructOpt)]
struct Cli {
    /// 3d hash algorithm
    #[structopt(short, long)]
    /// Algorithm. Supported algorithms: Grid2d
    algo: String,

    #[structopt(short, long)]
    /// Number of cells in Grid2d algorithm
    grid: i16,

    #[structopt(short, long)]
    /// Number of sections in Grid2d algorithm
    sect: i16,

    #[structopt(short, long, parse(from_os_str))] //, default_value = "data/st1.obj")]
    /// The path to the file to read
    infile: std::path::PathBuf,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Cli::from_args();

    let mut res_hashes = Ok(vec![]);
    let mut file = File::open(&args.infile).expect("No file found");
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).expect("Can't read inout file");

    if args.algo == "grid2d" {
        res_hashes = p3d_process(buffer.as_slice(), AlgoType::Grid2d, args.grid, args.sect, Some([20, 30, 40, 20]));
    }
    else if args.algo == "grid2d_v2" {
        res_hashes = p3d_process(buffer.as_slice(), AlgoType::Grid2dV2, args.grid, args.sect, Some([20, 30, 40, 20]));
    }

    let hashes = res_hashes.unwrap();

    for h in &hashes {
        println!("{:?}", h);
    }
    Ok(())
}

