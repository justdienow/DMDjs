  
//Pixel/graphics writing modes (bGraphicsMode)
const GRAPHICS_NORMAL  = 0;
const GRAPHICS_INVERSE = 1;
const GRAPHICS_TOGGLE  = 2;
const GRAPHICS_OR      = 3;
const GRAPHICS_NOR     = 4;

//drawTestPattern Patterns
const PATTERN_ALT_0    = 0;
const PATTERN_ALT_1    = 1;
const PATTERN_STRIPE_0 = 2;
const PATTERN_STRIPE_1 = 3;

//display screen (and subscreen) sizing
const DMD_PIXELS_ACROSS  = 32; //pixels across x axis (base 2 size expected)
const DMD_PIXELS_DOWN    = 16; //pixels down y axis
const DMD_BITSPERPIXEL   = 1;  //1 bit per pixel, use more bits to allow for pwm screen brightness control
const DMD_RAM_SIZE_BYTES = (Math.floor(DMD_PIXELS_ACROSS * DMD_BITSPERPIXEL / 8) * DMD_PIXELS_DOWN); // (32x * 1 / 8) = 4 bytes, * 16y = 64 bytes per screen here.

//lookup table for writePixel() to make the pixel indexing routine faster
const bPixelLookupTable = [
  0x80,   //0, bit 7
  0x40,   //1, bit 6
  0x20,   //2. bit 5
  0x10,   //3, bit 4
  0x08,   //4, bit 3
  0x04,   //5, bit 2
  0x02,   //6, bit 1
  0x01    //7, bit 0
];

// Font Indices
const FONT_LENGTH      = 0;
const FONT_FIXED_WIDTH = 2;
const FONT_HEIGHT      = 3;
const FONT_FIRST_CHAR  = 4;
const FONT_CHAR_COUNT  = 5;
const FONT_WIDTH_TABLE = 6;

// var FontCallback = (static uint8_t) => uint8_t;

const SYSTEM5x7_WIDTH   = 5;
const SYSTEM5x7_HEIGHT  = 7;

const System5x7 = [
  0x00, 0x00,                   // size of zero indicates fixed width font, actual length is width * height
  0x05,                         // width      - base10 = 5
  0x07,                         // height     - base10 = 7
  0x20,                         // first char - base10 = 32
  0x60,                         // char count - base10 = 96
  
  // Fixed width; char width table not used !!!!

  // font data
  0x00, 0x00, 0x00, 0x00, 0x00, // (space) -- not counted? ¯\_(ツ)_/¯
  0x00, 0x00, 0x5F, 0x00, 0x00, // \! 0
  0x00, 0x07, 0x00, 0x07, 0x00, // "
  0x14, 0x7F, 0x14, 0x7F, 0x14, // #
  0x24, 0x2A, 0x7F, 0x2A, 0x12, // $
  0x23, 0x13, 0x08, 0x64, 0x62, // %
  0x36, 0x49, 0x55, 0x22, 0x50, // &
  0x00, 0x05, 0x03, 0x00, 0x00, // '
  0x00, 0x1C, 0x22, 0x41, 0x00, // (
  0x00, 0x41, 0x22, 0x1C, 0x00, // )
  0x08, 0x2A, 0x1C, 0x2A, 0x08, // \* 
  0x08, 0x08, 0x3E, 0x08, 0x08, // +  10
  0x00, 0x50, 0x30, 0x00, 0x00, // ,  11
  0x08, 0x08, 0x08, 0x08, 0x08, // -
  0x00, 0x60, 0x60, 0x00, 0x00, // .
  0x20, 0x10, 0x08, 0x04, 0x02, // /
  0x3E, 0x51, 0x49, 0x45, 0x3E, // 0
  0x00, 0x42, 0x7F, 0x40, 0x00, // 1
  0x42, 0x61, 0x51, 0x49, 0x46, // 2
  0x21, 0x41, 0x45, 0x4B, 0x31, // 3
  0x18, 0x14, 0x12, 0x7F, 0x10, // 4  
  0x27, 0x45, 0x45, 0x45, 0x39, // 5  20
  0x3C, 0x4A, 0x49, 0x49, 0x30, // 6  21
  0x01, 0x71, 0x09, 0x05, 0x03, // 7
  0x36, 0x49, 0x49, 0x49, 0x36, // 8
  0x06, 0x49, 0x49, 0x29, 0x1E, // 9
  0x00, 0x36, 0x36, 0x00, 0x00, // :
  0x00, 0x56, 0x36, 0x00, 0x00, // ;
  0x00, 0x08, 0x14, 0x22, 0x41, // <
  0x14, 0x14, 0x14, 0x14, 0x14, // =
  0x41, 0x22, 0x14, 0x08, 0x00, // >  
  0x02, 0x01, 0x51, 0x09, 0x06, // \? 30
  0x32, 0x49, 0x79, 0x41, 0x3E, // @  31
  0x7E, 0x11, 0x11, 0x11, 0x7E, // A
  0x7F, 0x49, 0x49, 0x49, 0x36, // B
  0x3E, 0x41, 0x41, 0x41, 0x22, // C
  0x7F, 0x41, 0x41, 0x22, 0x1C, // D
  0x7F, 0x49, 0x49, 0x49, 0x41, // E
  0x7F, 0x09, 0x09, 0x01, 0x01, // F
  0x3E, 0x41, 0x41, 0x51, 0x32, // G
  0x7F, 0x08, 0x08, 0x08, 0x7F, // H
  0x00, 0x41, 0x7F, 0x41, 0x00, // I  40
  0x20, 0x40, 0x41, 0x3F, 0x01, // J  41
  0x7F, 0x08, 0x14, 0x22, 0x41, // K
  0x7F, 0x40, 0x40, 0x40, 0x40, // L
  0x7F, 0x02, 0x04, 0x02, 0x7F, // M
  0x7F, 0x04, 0x08, 0x10, 0x7F, // N
  0x3E, 0x41, 0x41, 0x41, 0x3E, // O
  0x7F, 0x09, 0x09, 0x09, 0x06, // P
  0x3E, 0x41, 0x51, 0x21, 0x5E, // Q
  0x7F, 0x09, 0x19, 0x29, 0x46, // R
  0x46, 0x49, 0x49, 0x49, 0x31, // S  50
  0x01, 0x01, 0x7F, 0x01, 0x01, // T  51
  0x3F, 0x40, 0x40, 0x40, 0x3F, // U
  0x1F, 0x20, 0x40, 0x20, 0x1F, // V
  0x7F, 0x20, 0x18, 0x20, 0x7F, // W
  0x63, 0x14, 0x08, 0x14, 0x63, // X
  0x03, 0x04, 0x78, 0x04, 0x03, // Y
  0x61, 0x51, 0x49, 0x45, 0x43, // Z
  0x00, 0x00, 0x7F, 0x41, 0x41, // [
  0x02, 0x04, 0x08, 0x10, 0x20, // "\"
  0x41, 0x41, 0x7F, 0x00, 0x00, // ]  60
  0x04, 0x02, 0x01, 0x02, 0x04, // ^  61
  0x40, 0x40, 0x40, 0x40, 0x40, // _
  0x00, 0x01, 0x02, 0x04, 0x00, // `
  0x20, 0x54, 0x54, 0x54, 0x78, // a
  0x7F, 0x48, 0x44, 0x44, 0x38, // b
  0x38, 0x44, 0x44, 0x44, 0x20, // c
  0x38, 0x44, 0x44, 0x48, 0x7F, // d
  0x38, 0x54, 0x54, 0x54, 0x18, // e
  0x08, 0x7E, 0x09, 0x01, 0x02, // f
  0x08, 0x14, 0x54, 0x54, 0x3C, // g  70
  0x7F, 0x08, 0x04, 0x04, 0x78, // h  71
  0x00, 0x44, 0x7D, 0x40, 0x00, // i  
  0x20, 0x40, 0x44, 0x3D, 0x00, // j  
  0x00, 0x7F, 0x10, 0x28, 0x44, // k
  0x00, 0x41, 0x7F, 0x40, 0x00, // l
  0x7C, 0x04, 0x18, 0x04, 0x78, // m
  0x7C, 0x08, 0x04, 0x04, 0x78, // n
  0x38, 0x44, 0x44, 0x44, 0x38, // o
  0x7C, 0x14, 0x14, 0x14, 0x08, // p
  0x08, 0x14, 0x14, 0x18, 0x7C, // q  80
  0x7C, 0x08, 0x04, 0x04, 0x08, // r  81
  0x48, 0x54, 0x54, 0x54, 0x20, // s
  0x04, 0x3F, 0x44, 0x40, 0x20, // t
  0x3C, 0x40, 0x40, 0x20, 0x7C, // u
  0x1C, 0x20, 0x40, 0x20, 0x1C, // v
  0x3C, 0x40, 0x30, 0x40, 0x3C, // w
  0x44, 0x28, 0x10, 0x28, 0x44, // x
  0x0C, 0x50, 0x50, 0x50, 0x3C, // y
  0x44, 0x64, 0x54, 0x4C, 0x44, // z
  0x00, 0x08, 0x36, 0x41, 0x00, // {  90
  0x00, 0x00, 0x7F, 0x00, 0x00, // |  91
  0x00, 0x41, 0x36, 0x08, 0x00, // }  
  0x08, 0x08, 0x2A, 0x1C, 0x08, // ->
  0x08, 0x1C, 0x2A, 0x08, 0x08  // <- 94
];

/*--------------------------------------------------------------------------------------

Lets do the thing here :)

--------------------------------------------------------------------------------------*/

let dmd;                            // DMD object
var canvas, ctx, img;               // Variables for the canvas
let panWide         = 1;            // Number of panels in width  (x)
let panHigh         = 1;            // Number of panels in height (y)
const canvPixWidth  = 640;          // Pix width of the canvas    (x)
const canvPixHeight = 320;          // Pix height of the canvas   (y)
const dotDiameter   = 10;           // Pix diameter of "LEDs"
const dotSpacing    = 20;           // Pix space center to center of "LEDs"

function setup() {
  // DMD Stuff
  dmd = new DMD(panWide, panHigh);  // 1 display wide, 1 display high.
  dmd.clearScreen(true);            // Initalise the display
  dmd.selectFont(System5x7);        // Select Font

  // We write some data to bDMDScreenRAM
  // dmd.drawChar(  0, 0,'A', GRAPHICS_NORMAL); // Test the letter A
  // dmd.drawChar(  5, 0,' ', GRAPHICS_NORMAL); // Test white space (no pix on)
  // dmd.drawChar( 10, 0,'1', GRAPHICS_NORMAL); // Test the number 1

  for (let x=0; x < 1; x++) {
    for (let y=0; y < 1; y++) {
      dmd.drawString(2+(32*x), 1+(16*y), "Hello", 5, GRAPHICS_NORMAL);
      dmd.drawString(2+(32*x), 9+(16*y), "World", 5, GRAPHICS_NORMAL);
    }
  }

  // Have a look what it looks like in memory - using these will slow things down.
  // print(dmd.bDMDScreenRAM);         // Dump the contents of virtual ram to console
  // dmd.displayBitsConsole();         // We display the bits matrix to console

  // Canvas Stuff
  createCanvas(canvPixWidth*panWide, canvPixHeight*panHigh);
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  // Create a array that will store the bits, based on pixel density and number of panels.
  // We initialise the array it to '0'.
  let dmdBitsArray = new Array(DMD_PIXELS_DOWN*panHigh);
  for (let i = 0; i < dmdBitsArray.length; i++) {
    dmdBitsArray[i] = new Array(DMD_PIXELS_ACROSS*panWide).fill(0);
  }

  // We now call the member function that will convert the object RAM to bits. We store this
  // in our new array we just created.
  dmdBitsArray = dmd.getDisplayBits();

  // Now we write the bits to the canvas
  for (let i = 0; i < DMD_PIXELS_DOWN*panHigh; i++) {
    for (let j = 0; j < DMD_PIXELS_ACROSS*panWide; j++) {
      if(dmdBitsArray[i][j] === 1) {
        ctx.fillStyle = "red"; 
      } else {
        ctx.fillStyle = "#4D0000";
      }
      ctx.beginPath();
      ctx.arc(j * dotSpacing + dotSpacing / 2, i * dotSpacing + dotSpacing / 2, dotDiameter / 2, 0, Math.PI * 2, false);
      ctx.fill(); 
      img = loadImage(canvas.toDataURL());
    }
  }
}

function draw() {
  // put drawing code here
  image(img, 0, 0);
}

/*--------------------------------------------------------------------------------------

DMD:
Function and support library for a 512 matrix display arranged in a 32 x 16 layout.

Matrix layout in "virtuial RAM" - x and y location (0,0 is the top left corner)
                            32 pixels (4 bytes) (X)
        top left  ----------------------------------------
                  |                                      |
         Screen 1 |        512 pixels (64 bytes)         | 16 pixels (Y)
                  |                                      |
                  ---------------------------------------- bottom right

KNOWN ISSUES: 
1. As you add more displays, the slower the page loads by an order of magnitude; so, some 
optimization will need to be done.
2. As you add more displays down, either the bDMDScreenRAM gets corrupt and anomalies
present themselves.

TODO:
1. Add support to split out the DMD class into it's own files.
2. Add support for more fonts, again, split out to it's own files.
3. Optimise code.

LICENSE:
This program is free software: you can redistribute it and/or modify it under the terms
of the version 3 GNU General Public License as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <http://www.gnu.org/licenses/>.

--------------------------------------------------------------------------------------*/

class DMD {
  constructor(panelsWide, panelsHigh) {
    this.DisplaysWide = panelsWide;
    this.DisplaysHigh = panelsHigh;
    this.ui = 0;
    this.DisplaysTotal = this.DisplaysWide * this.DisplaysHigh;
    this.bDMDScreenRAM = new Array(this.DisplaysTotal * DMD_RAM_SIZE_BYTES);
    this.marqueeText = [];
    this.marqueeLength = 0;
    this.marqueeWidth = 0;
    this.marqueeHeight = 0;
    this.marqueeOffsetX = 0;
    this.marqueeOffsetY = 0;
    this.Font = null;
    this.bDMDByte = 0;
    this.clearScreen(true);
  }

  //The main class of DMD library functions

  //Clear the screen in DMD RAM
  clearScreen(bNormal) {
    if (bNormal) {
      // clear all pixels
      this.bDMDScreenRAM.fill(0x00);
    } else {
      // set all pixels
      this.bDMDScreenRAM.fill(0xff);
    }
  }

  //Select a text font
  selectFont(font) {
    this.Font = font;
  }

  //Set or clear a pixel at the x and y location (0,0 is the top left corner)
  writePixel(bX, bY, bGraphicsMode, bPixel) {
    let uiDMDRAMPointer;

    if (bX >= (DMD_PIXELS_ACROSS * this.DisplaysWide) || bY >= (DMD_PIXELS_DOWN * this.DisplaysHigh)) {
      return;
    }

    let panel = Math.floor(bX / DMD_PIXELS_ACROSS) + (this.DisplaysWide * Math.floor(bY / DMD_PIXELS_DOWN));
    bX = (bX % DMD_PIXELS_ACROSS) + (panel << 5);
    bY = bY % DMD_PIXELS_DOWN;
    //set pointer to DMD RAM byte to be modified
    uiDMDRAMPointer = Math.floor(bX / 8) + bY * (this.DisplaysTotal << 2);

    let lookup = bPixelLookupTable[bX & 0x07];

    // This section may need tweaking. The original library would cater for bits where
    // 1 = Off and 0 = On. Now, we handle bits where 1 = On, 0 = Off.
    switch (bGraphicsMode) {
      case GRAPHICS_NORMAL:
        if (bPixel === false || bPixel === 0) {
          this.bDMDScreenRAM[uiDMDRAMPointer] &= ~lookup;
        } else {
          this.bDMDScreenRAM[uiDMDRAMPointer] |= lookup; 
        }
        break;
      case GRAPHICS_INVERSE:
        if (bPixel === false || bPixel === 0) {
          this.bDMDScreenRAM[uiDMDRAMPointer] &= ~lookup;
        } else {
          this.bDMDScreenRAM[uiDMDRAMPointer] |= lookup;
        }
        break;
      case GRAPHICS_TOGGLE:
        if (bPixel === true || bPixel === 1) {
          if ((this.bDMDScreenRAM[uiDMDRAMPointer] & lookup) === 0) {
            this.bDMDScreenRAM[uiDMDRAMPointer] |= lookup;
          } else {
            this.bDMDScreenRAM[uiDMDRAMPointer] &= ~lookup;
          }
        }
        break;
      case GRAPHICS_OR:
        //only set pixels on
        if (bPixel === true || bPixel === 1) {
          this.bDMDScreenRAM[uiDMDRAMPointer] &= ~lookup;
        }
        break;
      case GRAPHICS_NOR:
        //only clear on pixels
        if ((bPixel === true || bPixel === 1) && ((this.bDMDScreenRAM[uiDMDRAMPointer] & lookup) === 0)) {
          this.bDMDScreenRAM[uiDMDRAMPointer] |= lookup;
        }
        break;
    }
  }

  //Draw a single character
  drawChar(bX, bY, letter, bGraphicsMode) {
    if (bX > (DMD_PIXELS_ACROSS * this.DisplaysWide) || bY > (DMD_PIXELS_DOWN * this.DisplaysHigh)) {
      return -1;
    }
    
    let c = letter.charCodeAt();
    let height = this.Font[FONT_HEIGHT];
    if (c == 32) { // 32 = ' ' (space)
      let charWide = this.charWidth(' ');
      // Might need to change the bGraphicsMode later.
      this.drawFilledBox(bX, bY, bX + charWide, bY + height, GRAPHICS_OR);
      return charWide;
    }

    let width = 0;
    let bytes = Math.floor((height + 7) / 8);


    let firstChar = this.Font[FONT_FIRST_CHAR];
    let charCount = this.Font[FONT_CHAR_COUNT];

    let index = 0;
    
    if (c < firstChar || c >= firstChar + charCount) {
      return 0;
    }
    
    c -= firstChar;

    // zero length is flag indicating fixed width font (array does not contain width data entries)
    // Here we grab the index of the character we would like to display.
    if (this.Font[FONT_LENGTH] === 0 && this.Font[FONT_LENGTH + 1] === 0) {
      width = this.Font[FONT_FIXED_WIDTH];
      index = c * bytes * width + FONT_WIDTH_TABLE;
    } else {
      for (let i = 0; i < c; i++) {
        index += this.Font[FONT_WIDTH_TABLE + i];
      }
      index = index * bytes + charCount + FONT_WIDTH_TABLE;
      width = this.Font[FONT_WIDTH_TABLE + c];
    }
    
    if (bX < -width || bY < -height) {
      return width;
    }

    // last but not least, draw the character
    for (let j = 0; j < width; j++) { // Width
      for (let i = bytes - 1; i >= 0; i--) { // This might Byte me on the ass
        let data = this.Font[index + j + (i * width)];
        let offset = i * 8;
        if (i === bytes - 1 && bytes > 1) {
          offset = height - 8;
        }

        for (let k = 0; k < 8; k++) { // Vertical bits
          if (offset + k >= i * 8 && offset + k <= height) {
            if (data & (1 << k)) {
              this.writePixel(bX + j, bY + offset + k, bGraphicsMode, true);
            } else {
              this.writePixel(bX + j, bY + offset + k, bGraphicsMode, false);
            }
          }
        }
      }
    }
    return width;
  }

  //Find the width of a character
  charWidth(letter) {
    let c = letter.charCodeAt();
    // Space is often not included in font so use width of 'n'
    if (c === 32) {
      c = 'n';
    }

    let width = 0;

    let firstChar = this.Font[FONT_FIRST_CHAR];
    let charCount = this.Font[FONT_CHAR_COUNT];

    if (c < firstChar || c >= (firstChar + charCount)) {
      return 0;
    }

    c -= firstChar;

    if (this.Font[FONT_LENGTH] === 0 && this.Font[FONT_LENGTH + 1] === 0) {
      // zero length is flag indicating fixed width font (array does not contain width data entries)
      width = this.Font[FONT_FIXED_WIDTH];
    } else {
      // variable width font, read width data
      width = this.Font[FONT_WIDTH_TABLE + c];
    }
    return width;
  }

  //Draw a string
  drawString(bX, bY, bChars, length, bGraphicsMode) {
    const height = this.Font[FONT_HEIGHT];
    if (bX >= (DMD_PIXELS_ACROSS * this.DisplaysWide) || bY >= DMD_PIXELS_DOWN * this.DisplaysHigh || bY + height < 0) {
      return;
    }
    let strWidth = 0;
    this.drawLine(bX - 1, bY, bX - 1, bY + height, GRAPHICS_OR);
    for (let i = 0; i < length; i++) {
      let charWide = this.drawChar(bX + strWidth, bY, bChars[i], bGraphicsMode);
      if (charWide > 0) {
        strWidth += charWide;
        this.drawLine(bX + strWidth, bY, bX + strWidth, bY + height, GRAPHICS_OR);
        strWidth++;
      } else if (charWide < 0) {
        return;
      }
      if (bX + strWidth >= DMD_PIXELS_ACROSS * this.DisplaysWide || bY >= DMD_PIXELS_DOWN * this.DisplaysHigh) {
        return;
      }
    }
  }

  // TODO - PARTIALLY TESTED
  //Draw a scrolling string
  drawMarquee(bChars, length, left, top) {
    this.marqueeWidth = 0;
    for (let i = 0; i < length; i++) {
      this.marqueeText[i] = bChars.charAt(i);
      this.marqueeWidth += this.charWidth(bChars.charAt(i)) + 1;
    }
    this.marqueeHeight = this.Font[FONT_HEIGHT];
    this.marqueeText[length] = '\0';
    this.marqueeOffsetY = top;
    this.marqueeOffsetX = left;
    this.marqueeLength = length;
    this.drawString(this.marqueeOffsetX, this.marqueeOffsetY, this.marqueeText, this.marqueeLength, GRAPHICS_NORMAL);
  }

  // TODO - TEST
  //Move the maquee accross by amount
  stepMarquee(amountX, amountY) {
    let ret = false;
    this.marqueeOffsetX += amountX;
    this.marqueeOffsetY += amountY;
    if (this.marqueeOffsetX < -this.marqueeWidth) {
      this.marqueeOffsetX = DMD_PIXELS_ACROSS * this.DisplaysWide;
      this.clearScreen(true);
      ret = true;
    } else if (this.marqueeOffsetX > DMD_PIXELS_ACROSS * this.DisplaysWide) {
      this.marqueeOffsetX = -this.marqueeWidth;
      this.clearScreen(true);
      ret = true;
    }

    if (this.marqueeOffsetY < -this.marqueeHeight) {
      this.marqueeOffsetY = DMD_PIXELS_DOWN * this.DisplaysHigh;
      this.clearScreen(true);
      ret = true;
    } else if (this.marqueeOffsetY > DMD_PIXELS_DOWN * this.DisplaysHigh) {
      this.marqueeOffsetY = -this.marqueeHeight;
      this.clearScreen(true);
      ret = true;
    }

    // Special case horizontal scrolling to improve speed
    if (amountY === 0 && amountX === -1) {
      // Shift entire screen one bit
      for (let i = 0; i < DMD_RAM_SIZE_BYTES * this.DisplaysTotal; i++) {
        if (i % (this.DisplaysWide * 4) === (this.DisplaysWide * 4) - 1) {
          this.bDMDScreenRAM[i] = (this.bDMDScreenRAM[i] << 1) + 1;
        } else {
          this.bDMDScreenRAM[i] = (this.bDMDScreenRAM[i] << 1) + ((this.bDMDScreenRAM[i + 1] & 0x80) >> 7);
        }
      }

      // Redraw last char on screen
      let strWidth = this.marqueeOffsetX;
      for (let i = 0; i < this.marqueeLength; i++) {
        let wide = this.charWidth(this.marqueeText[i]);
        if (strWidth + wide >= this.DisplaysWide * DMD_PIXELS_ACROSS) {
          this.drawChar(strWidth, this.marqueeOffsetY, this.marqueeText[i], GRAPHICS_NORMAL);
          return ret;
        }
        strWidth += wide + 1;
      }
    } else if (amountY === 0 && amountX === 1) {
      // Shift entire screen one bit
      for (let i = (DMD_RAM_SIZE_BYTES * this.DisplaysTotal) - 1; i >= 0; i--) {
        if (i % (this.DisplaysWide * 4) === 0) {
          this.bDMDScreenRAM[i] = (this.bDMDScreenRAM[i] >> 1) + 128;
        } else {
          this.bDMDScreenRAM[i] = (this.bDMDScreenRAM[i] >> 1) + ((this.bDMDScreenRAM[i - 1] & 1) << 7);
        }
      }

      // Redraw last char on screen
      let strWidth = this.marqueeOffsetX;
      for (let i = 0; i < marqueeLength; i++) {
        let wide = this.charWidth(this.marqueeText[i]);
        if (strWidth + wide >= 0) {
          this.drawChar(strWidth, this.marqueeOffsetY, this.marqueeText[i], GRAPHICS_NORMAL);
          return ret;
        }
        strWidth += wide + 1;
      }
    } else {
      this.drawString(this.marqueeOffsetX, this.marqueeOffsetY, this.marqueeText, marqueeLength, GRAPHICS_NORMAL);
    }

    return ret;
  }

  //Draw or clear a line from x1,y1 to x2,y2
  drawLine(x1, y1, x2, y2, bGraphicsMode) {
    let dy = y2 - y1;
    let dx = x2 - x1;
    let stepx, stepy;
  
    if (dy < 0) {
      dy = -dy;
      stepy = -1;
    } else {
      stepy = 1;
    }

    if (dx < 0) {
      dx = -dx;
      stepx = -1;
    } else {
      stepx = 1;
    }

    dy <<= 1;
    dx <<= 1;
    
    this.writePixel(x1, y1, bGraphicsMode, true);
    if (dx > dy) {
      let fraction = dy - (dx >> 1);
      while (x1 != x2) {
        if (fraction >= 0) {
          y1 += stepy;
          fraction -= dx;
        }

        x1 += stepx;
        fraction += dy;
        this.writePixel(x1, y1, bGraphicsMode, true);
      }
    } else {
      let fraction = dx - (dy >> 1);
      while (y1 != y2) {
        if (fraction >= 0) {
          x1 += stepx;
          fraction -= dy;
        }

        y1 += stepy;
        fraction += dx;
        this.writePixel(x1, y1, bGraphicsMode, true);
      }
    }
  }

  //Draw or clear a box(rectangle) with a single pixel border
  drawBox(x1, y1, x2, y2, bGraphicsMode) {
    this.drawLine(x1, y1, x2, y1, bGraphicsMode);
    this.drawLine(x2, y1, x2, y2, bGraphicsMode);
    this.drawLine(x2, y2, x1, y2, bGraphicsMode);
    this.drawLine(x1, y2, x1, y1, bGraphicsMode);
  }

  //Draw or clear a filled box(rectangle) with a single pixel border
  drawFilledBox(x1, y1, x2, y2, bGraphicsMode) {
    for (let b = x1; b <= x2; b++) {
      this.drawLine(b, y1, b, y2, bGraphicsMode);
    }
  }

  //Draw the selected test pattern
  drawTestPattern(bPattern) {
    let numPixels = this.DisplaysTotal * DMD_PIXELS_ACROSS * DMD_PIXELS_DOWN;
    let pixelsWide = DMD_PIXELS_ACROSS * this.DisplaysWide;
    for (let ui = 0; ui < numPixels; ui++) {
      switch (bPattern) {
        case PATTERN_ALT_0: // every alternate pixel, first pixel on
          if ((ui & pixelsWide) == 0)
            //even row
            this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, !(ui & 1));
          else
            //odd row
            this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, ui & 1);
          break;
        case PATTERN_ALT_1: // every alternate pixel, first pixel off
          if ((ui & pixelsWide) == 0)
            //even row
            this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, ui & 1);
          else
            //odd row
            this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, !(ui & 1));
          break;
        case PATTERN_STRIPE_0: // vertical stripes, first stripe on
          this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, !(ui & 1));
          break;
        case PATTERN_STRIPE_1: // vertical stripes, first stripe off
          this.writePixel((ui & (pixelsWide - 1)), (Math.floor((ui & ~(pixelsWide - 1)) / pixelsWide)), GRAPHICS_NORMAL, ui & 1);
          break;
      }
    }
  }

  //Draw or clear a circle of radius r at x,y centre
  drawCircle(xCenter, yCenter, radius, bGraphicsMode) {
    let x = 0;
    let y = radius;
    let p = Math.floor((5 - radius * 4) / 4);
  
    this.#drawCircleSub(xCenter, yCenter, x, y, bGraphicsMode);
    while (x < y) {
      x++;
      if (p < 0) {
        p += 2 * x + 1;
      } else {
        y--;
        p += 2 * (x - y) + 1;
      }
      this.#drawCircleSub(xCenter, yCenter, x, y, bGraphicsMode);
    }
  }

  // This is to print all the bits to console so you don't have to convert the hex data manually
  displayBitsConsole() {
    let pixX = this.DisplaysWide * DMD_PIXELS_ACROSS;
    let pixY = this.DisplaysHigh * DMD_PIXELS_DOWN;

    print("pixX :: " + pixX);
    print("pixY :: " + pixY);
    
    // Matrix header only for 1 panel wide.
    print("Col X ::    | 00000000001111111111222222222233");
    print("Col X ::____| 01234567890123456789012345678901");

    for (let row = 0; row < pixY; row++) {
      let rowStr = "Row Y :: " + String(row).padStart(2, '0') + " | "; // This is needed as we need to ensure each line is printed.
      // print("Row :: " + row);
      for (let col = 0; col < pixX; col++) {
        // print("Col :: " + col);
        const byteIndex = Math.floor((row * pixX + col) / 8);
        // const bitIndex = (row * pixX + col) % 8;
        const bitIndex = 7 - ((row * pixX + col) % 8); // reverse order of bits
        const bitVal = (this.bDMDScreenRAM[byteIndex] & (1 << bitIndex)) !== 0 ? 1 : 0;
        rowStr += bitVal;
      }
      print(rowStr);
    }
  }

  getDisplayBits() {
    let pixX = this.DisplaysWide * DMD_PIXELS_ACROSS;
    let pixY = this.DisplaysHigh * DMD_PIXELS_DOWN;

    let bitsArray = new Array(pixY);
    for (let i = 0; i < bitsArray.length; i++) {
      bitsArray[i] = new Array(pixX).fill(0);
    }
    
    for (let row = 0; row < pixY; row++) {
      for (let col = 0; col < pixX; col++) {
        const byteIndex = Math.floor((row * pixX + col) / 8);
        const bitIndex = 7 - ((row * pixX + col) % 8); // reverse order of bits
        bitsArray[row][col] = (this.bDMDScreenRAM[byteIndex] & (1 << bitIndex)) !== 0 ? 1 : 0;
      }
    }
    return bitsArray; 
  }

  // Private funtions
  #drawCircleSub(cx, cy, x, y, bGraphicsMode) {
    if (x === 0) {
      this.writePixel(cx, cy + y, bGraphicsMode, true);
      this.writePixel(cx, cy - y, bGraphicsMode, true);
      this.writePixel(cx + y, cy, bGraphicsMode, true);
      this.writePixel(cx - y, cy, bGraphicsMode, true);
    } else if (x === y) {
      this.writePixel(cx + x, cy + y, bGraphicsMode, true);
      this.writePixel(cx - x, cy + y, bGraphicsMode, true);
      this.writePixel(cx + x, cy - y, bGraphicsMode, true);
      this.writePixel(cx - x, cy - y, bGraphicsMode, true);
    } else if (x < y) {
      this.writePixel(cx + x, cy + y, bGraphicsMode, true);
      this.writePixel(cx - x, cy + y, bGraphicsMode, true);
      this.writePixel(cx + x, cy - y, bGraphicsMode, true);
      this.writePixel(cx - x, cy - y, bGraphicsMode, true);
      this.writePixel(cx + y, cy + x, bGraphicsMode, true);
      this.writePixel(cx - y, cy + x, bGraphicsMode, true);
      this.writePixel(cx + y, cy - x, bGraphicsMode, true);
      this.writePixel(cx - y, cy - x, bGraphicsMode, true);
    }
  }
}