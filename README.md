# Saving canvas to hdr file format
## project overview
  I'll do it later
## hdr format tutorial
![alt text](https://matheowis.github.io/threejs-canvas-save-as-hdr/images/tutorial-img.png)
Lets say we want to save the image above to hdr format
```
Color(red, green, blue, emmisive)
leftColor = Color(20,70,150,128)
rightColor = Color(150,130,40,128)
```
Each file contains header, resolution and pixelData
```
var header = "FORMAT=32-bit_rle_rgbe\n"
var blankSpace = "\n";
var Resolution = "-Y 180 +X 320\n";
```
headers and ressolution have to be separated by empty line

Now lets take care of pixelData

We have to write each line of pixels starting from upper left image corner.
First two bytes of each line have to be (2, 2) - that defines the format of pixel data,
another two bytes defines the length of pixel row in this situation its 320 so in bytes (1,64).

Now we can start writting pixel values

Wy start with amount of repetition, where 128 means 0, this part i couldn't really understand, but based on photoshop files, I found out that only positive values are used, so maximum repetition is 255 which means 127

###Channels
We define each channel separately, start with all reds in the row,then greens and so on.
reds:
```
255, 20, 161, 20, 255, 150, 161, 150,
```
greens:
```
255, 70, 161, 70, 255, 130, 161, 130,
```
blues:
```
255, 150, 161, 150, 255, 40, 161, 40,
```
emmisives:
```
255, 128, 255, 128, 194, 128
```
###Full line would look like
```
2, 2, 1, 64, 255, 20, 161, 20, 255, 150, 161, 150, 255, 70, 161, 70, 255, 130, 161, 130, 255, 150, 161, 150, 255, 40, 161, 40, 255, 128, 255, 128, 194, 128
```
###Binary Data

You can save binary with new Uint8Array()
```
var text = header + blankSpace + Resolution;
var binary = new Uint8Array([pixelData]) // bytes that we created above
var blob = new Blob([text, binary], { type: "octet/stream" });
```
That blob contains image in hdr format




