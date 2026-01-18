from PIL import Image

def check_transparency(path):
    try:
        img = Image.open(path)
        print(f"Format: {img.format}, Mode: {img.mode}")
        if img.mode != 'RGBA':
            print("Image is not RGBA (No Alpha Channel). It likely has a white background.")
            return

        extrema = img.getextrema()
        alpha_extrema = extrema[3] # (min, max) for alpha
        print(f"Alpha Channel Extrema: {alpha_extrema}")
        
        if alpha_extrema[0] == 255:
            print("Alpha channel is fully opaque (255). It has no transparency.")
        else:
            print("Image has transparency.")

    except Exception as e:
        print(f"Error: {e}")

check_transparency("public/logo_new.png")
