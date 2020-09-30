use structopt::StructOpt;
// use std::fs::File;
// use std::io::Write;

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

    // #[structopt(short, long, parse(from_os_str))] //, default_value = "data/st1.hash")]
    // // The path to the file to save results
    // outfile: std::path::PathBuf,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Cli::from_args();

    let mut res_hashes = Ok(vec![]);
    if args.algo == "grid2d" {
       res_hashes = p3d_process(&args.infile, AlgoType::Grid2d, args.grid, args.sect); //, None);
    }

    let hashes = res_hashes.unwrap();

    // match std::fs::write(&args.outfile, hashes) {
    //     Ok(()) => { println!("write file OK"); },
    //     Err(error) => { return Err(error.into());  }
    // }
    // let mut f = File::create(&args.outfile)?;

    for h in &hashes {
        // write!(f, "{}", h)?;
        println!("{:?}", h);
    }
    Ok(())
}

