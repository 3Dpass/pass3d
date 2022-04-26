# pass3d

3D object shape recognition CLI tools for Linux, using [p3d](https://github.com/3Dpass/p3d) and providing HASH IDs calculation and its verification.

- Pass3d has [Grid2d algorithm](https://michael25651209.medium.com/how-to-calculate-a-hash-of-3d-object-1e0e3669322d) implemented now, however it always encourages to contribute and create new ones to add. Join 3DPass community on [Discord](https://discord.gg/u24WkXcwug) to discuss and make your suggestions;
- The input is a 3D scan/model of the object (.stl or .obj formats required).
For example, you can download these two ones: [pir1.obj](https://3dpass.org/assets/3dobjects/pir1_obj.zip) and [pir2.obj](https://3dpass.org/assets/3dobjects/pir2_obj.zip);
- The output is a Top10 hashes list inherent to the object shape.

Learn the [difference between HASH ID and NFT](https://github.com/3Dpass/3DP/wiki/HASH-ID-vs-NFT-difference)

USAGE:

    pass3d --algo  --grid  --infile  --sect

OPTIONS:

    -a, --algo         3d hash algorithm Algorithm. Supported algorithms: Grid2d
    -g, --grid         Number of cells in Grid2d algorithm
    -i, --infile       The path to the file to read
    -s, --sect         Number of sections in Grid2d algorithm


The object shape is considered to be recognized if there is at least one hash-value match among two different processing results. We have to process two or more different 3D scans of the same object and to compare the top10 results. We should use exactly the same parameters every time. It's recommended to use the same equipment, as well.

For example, we have two different 3D scans pir1.obj and pir2.obj of the same real physical object. In order to run processing and create hashes out of the first one we have to run a command like this:

## Mining:

    yarn mining

## Example:

 cargo run -- --algo grid2d --grid 8 --sect 68 --infile data/pir1.obj

 The output will be like this:

 ~/Desktop/3dpass$ ./pass3d -i pir1.obj -a grid2d -g 8 -s 68
Select top 10 hashes
"9bccac20a0586638cc74a2ff295c987d470794f24f008b02ce02643d0281f03f"
"11c41b6b30b191a2d61ae803d48cc42e83f9fdaac730665b24e3272672133efd"
"6f37f712139012d1c118cadea3a44b0535fa6b4b1272b1da49af3eb6498011f6"
"4453ed1aa4dabe394a0cedd79f8edb0940fb43a5558fbfa89ce56dad3fc8876c"
"aa4019c8c160da9d2af69edc19589aabd925bc696966b967f92b71947f75f8f0"
"090ae6b23e2192fa4c2fb40cddad6e8537e2b437c49ff9fb227cf32c4e4085fc"
"dd227121b91adcb5beabb0be9412613ebdfde8c5660301eb17583fa644b8793d"
"880cfda2b4811bf2ff1fe3ab92b38e64fc134d98c3dc8764eb8641a477b77a47"
"15cc9ef656a14c9ffde999512d11bd81cd5eaedaa81139a61847d470ea01043b"
"543e1c3929ea810f4e8c7cfc27f0b60df21a9374089f2278617dae327e32b034"

The second scan processing outcome gives us this:

~/Desktop/3dpass$ ./pass3d -i pir2.obj -a grid2d -g 8 -s 68
Select top 10 hashes
"72592f8f6ea67c60ca7d9c7683256c3636a30be464952eb82996bff52ca4415d"
"3720e731b9aa04b08d83de34a796cbc389fce2c62365c68206c5610106db053d"
"a65008cdc77f72b47eda70e7c2eb57f93e4fffde5a5356549ac7dbf5d422dffa"
"5930d4a4a98ddff21997daaa8410b151f85dcdb7bfe6b0fb1a05af0e99c276fc"
"6846a36abb6dc50df6845627e6553ede8337e7350254ae8d02b7b7a696c79192"
"b20cf89afb10f14795afe517c82d7f6185da840e6035c48b488792e2df61846d"
"aa4019c8c160da9d2af69edc19589aabd925bc696966b967f92b71947f75f8f0"
"deb83d22570bfc07b8881618dc34a6624616521475bac17798b7348cf6684fd1"
"dd227121b91adcb5beabb0be9412613ebdfde8c5660301eb17583fa644b8793d"
"543e1c3929ea810f4e8c7cfc27f0b60df21a9374089f2278617dae327e32b034"

Within those two processing results, we have three of top10 hash-values matched:

"aa4019c8c160da9d2af69edc19589aabd925bc696966b967f92b71947f75f8f0"
"dd227121b91adcb5beabb0be9412613ebdfde8c5660301eb17583fa644b8793d"
"543e1c3929ea810f4e8c7cfc27f0b60df21a9374089f2278617dae327e32b034"

So, we have the object recognized.
If we had no matches in the results the object wouldn't have been recognized.

## Parameters adjustment
These are two key parameters we need to adjust in order to create the best possible Hash ID depending on 3D scans quality.

  -g, --grid         Number of cells in Grid2d

  -s, --sect         Number of cross-sections in Grid2d

- Number of cells parameter -g:

Grid (-g) is the parameter which is about to help us to adjust the recognition algorithm to the particular 3D scan quality. The higher scan quality we get, the higher number of cells in the row we can set up for the processing. According to the Grid2d algorithm, by means of increasing number of cells, we are following a 3D scan cross-section contour more closely to the actual curve. That means that more precisely we can recognize the object shape. But, simultaneously, we're keeping less space for some error in the future. It's all about the balance between accuracy of the shape recognition and the ability to get the stable Hash ID.

Low definition scanners, especially smartphone apps, gives us a lot of error between two random scans taken from the same object. But High definition and professional ones might roll out not much than 3 micro meter error. So, it is recommended that we get several 3D scans made by the same equipment and then set the number of cells as hight as possible, provided it still rolls out successful recognition results. That is going to be the best set up. It might takes some attempts to adjust the optimal (-g) parameter’s value according to the scan quality.

Parameter -g=6 (6x6 grid) example:

![logo](https://3dpass.org/assets/img/6x6grid.png)

Parameter -g=20 (20x20 grid) example:

![logo](https://3dpass.org/assets/img/20x20grid.png)

Notice, that we should set the numebr of cells parameter (-g) up to the lowest quality of 3D scans we expect to process in the future. If we set the (-g) value to be appropriate for HD scanners (-g=20 or higher) but the scans won’t be there, then we’ll never reach the recognition success. -g=6 is recommended for low quality. We should use exactly the same set of parameters for the same object while processing. Otherwise, we won’t succeed in recognition.

- Number of cross-sections parameter -s:

The more cross-sections we set, the more hash strength we get. Each cross-section represents a unique contour which is, basically, the unique seed data the future hash would be created from. If we have captured more unique distinctions from the object shape, it would give us higher hash strength. For example, if we had set up just one cross-section (-s=1), we would leverage only one contour of the object which is really small amount of unique data. And it’s definitely not enough to describe the entire object shape. It’s like if we would try to describe the hole apple shape having just one slice of it. So, if you’re interested in recognition the entire object rather than a few slices of it, it’s recommended that you set up at least 100 cross-sections (-s=100).

Parameter -s=3 example:

![crossection3](https://3dpass.org/assets/img/-s_3.png)

Overall recommendations: It's recommended that we set up the number of cross-sections at least 100 (-s=100) in terms of leveraging the entire object shape instead of just a few slices.
- We should use exactly the same set of parameters for the same object while processing. Otherwise, we will not succeed in recognition;
- It's recommended to set up the grid parameter (-g) value according to the lowest scan definition we expect to process in the future. Such values as -g=6 or -g=7 (6x6 and 7x7 grid) would be recommended for smartphones and tablets;
- It's recommended that we set up the number of cross-sections at least 60 (-s=60) in terms of leveraging the entire object shape instead of just a few slices.

## Licence

This project is licensed under the MIT License
