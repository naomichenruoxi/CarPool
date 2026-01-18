from PIL import Image, ImageDraw

def flood_remove_bg(input_path, output_path, tolerance=30):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    width, height = img.size
    
    # Get colors from corners to identify background
    corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    bg_colors = set()
    for x, y in corners:
        bg_colors.add(img.getpixel((x, y)))
    
    print(f"Detected background candidates from corners: {bg_colors}")

    # Seed points for flood fill (starts at corners)
    # We will use ImageDraw.floodfill logic manually or just BFS
    # Since PIL doesn't have a direct "flood fill to transparent" easily exposed for complex conditions,
    # we'll do a BFS/queue approach.

    pixels = img.load()
    visited = set()
    queue = list(corners)
    
    # Mark corners as visited and transparent if they verify as background
    # Actually, let's assuming anything touching the edge that looks like a "background pattern" (grey/white) is bg.
    
    def is_bg_color(p):
        r, g, b, a = p
        # Check for White or Gray (Checkerboard)
        # Checkerboard usually: (255,255,255) or (204,204,204) or similar greys
        # We'll valid if R,G,B are close to each other (grey-scale/white) and High brightness?
        if abs(r-g) < tolerance and abs(g-b) < tolerance and abs(r-b) < tolerance:
            if r > 150: # Light colors only
                return True
        return False

    # Filter Queue to only valid bg starts
    valid_queue = []
    for x, y in queue:
        if is_bg_color(pixels[x, y]):
            valid_queue.append((x, y))
            visited.add((x, y))
            pixels[x, y] = (0, 0, 0, 0) # Make transparent

    queue = valid_queue
    
    processed_count = 0
    while queue:
        x, y = queue.pop(0)
        processed_count += 1
        
        # Check neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    color = pixels[nx, ny]
                    if is_bg_color(color):
                        pixels[nx, ny] = (0, 0, 0, 0)
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    img.save(output_path, "PNG")
    print(f"Processed {processed_count} pixels. Saved to {output_path}")

if __name__ == "__main__":
    flood_remove_bg("public/logo_new.png", "public/logo_final.png")
