#!/bin/bash

# Generate remaining 3 figure page variations from Earthy Sage template
# This script creates color scheme variations efficiently

BASE_FILE="wes-anderson-earthy-sage-figure.html"
OUTPUT_DIR="."

echo "Generating Sophisticated Neutral figure page..."
cat "$BASE_FILE" | \
  sed 's/Earthy Sage/Sophisticated Neutral/g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN \*\//#F4D9C6; \/\* PALE PEACH \*\//g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN/#F4D9C6; \/\* PALE PEACH/g' | \
  sed 's/background: #A8C9A8/background: #F4D9C6/g' | \
  sed 's/fill="#A8C9A8"/fill="#A8896D"/g' > "$OUTPUT_DIR/wes-anderson-sophisticated-neutral-figure.html"

echo "Generating Coastal Archive figure page..."
cat "$BASE_FILE" | \
  sed 's/Earthy Sage/Coastal Archive/g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN \*\//#5B9AA9; \/\* MID-BLUE \*\//g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN/#5B9AA9; \/\* MID-BLUE/g' | \
  sed 's/background: #A8C9A8/background: #5B9AA9/g' | \
  sed 's/color: #3A2F27/color: #FFFFFF/g' | \
  sed 's/fill="#A8C9A8"/fill="#5B9AA9"/g' > "$OUTPUT_DIR/wes-anderson-coastal-archive-figure.html"

echo "Generating Forest Study figure page..."
cat "$BASE_FILE" | \
  sed 's/Earthy Sage/Forest Study/g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN \*\//#2F5D50; \/\* BOTTLE GREEN \*\//g' | \
  sed 's/#A8C9A8; \/\* SAGE GREEN/#2F5D50; \/\* BOTTLE GREEN/g' | \
  sed 's/background: #A8C9A8/background: #2F5D50/g' | \
  sed 's/color: #3A2F27/color: #A8C9A8/g' | \
  sed 's/fill="#A8C9A8"/fill="#2F5D50"/g' > "$OUTPUT_DIR/wes-anderson-forest-study-figure.html"

echo "Done! Generated 3 figure page variations."
echo "Files created:"
echo "  - wes-anderson-sophisticated-neutral-figure.html"
echo "  - wes-anderson-coastal-archive-figure.html"
echo "  - wes-anderson-forest-study-figure.html"
