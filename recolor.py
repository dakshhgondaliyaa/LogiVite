from PIL import Image
import colorsys

def recolor_logo(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
                
            # Convert to HSV (0.0 - 1.0)
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            
            # If it's a blue-ish color (hue between 0.5 and 0.8) and has some color (s > 0.1)
            if 0.5 < h < 0.75 and s > 0.1:
                # Distinguish deep blue vs bright cyan based on Value (lightness) and Saturation
                # Deep blue (truck, LOGIBRISK text) tends to have lower V or different hue
                # Let's say if it's "darker" (V < 0.7) OR it's more purplish blue (h > 0.6), it's the deep blue.
                # Actually, Cyan has high G and B. Deep blue has low G.
                if g < 120: 
                    # Deep Blue -> Graphite (#18181B)
                    # Graphite is RGB(24, 24, 27)
                    # We just map it to a dark gray, preserving some of the original shading
                    # Target V is around 0.1
                    new_v = v * 0.3 # Darken it
                    new_r, new_g, new_b = colorsys.hsv_to_rgb(0, 0, new_v)
                else:
                    # Bright Cyan -> Yellow (#EAB308)
                    # Target Hue is Yellow (~0.13)
                    # Target is RGB(234, 179, 8)
                    new_h = 0.125
                    new_s = 0.9 # High saturation for yellow
                    new_v = v # Preserve original lightness/shading
                    # Boost value slightly so yellow is bright
                    new_v = min(1.0, new_v * 1.2)
                    new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, new_v)
                
                pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)

    img.save(output_path)
    print(f"Saved recolored logo to {output_path}")

if __name__ == "__main__":
    recolor_logo("images/logo-logibrisk-new.png", "images/logo-logibrisk-new.png")
