# How to Upload Thumbnails & Images

## Video Thumbnails

### Option 1: Upload from Computer (NEW!)
1. Go to Admin Dashboard → Videos
2. Click "Add New Video" or edit existing video
3. Scroll to "Thumbnail Image" section
4. Click "Choose File" button
5. Select image from your computer (.jpg, .png, etc.)
6. Wait for "✓ Thumbnail uploaded" confirmation
7. Preview appears below the upload button
8. Save the video

### Option 2: Use URL
1. Find thumbnail URL (e.g., from YouTube)
2. Paste in "Thumbnail URL" field
3. Save

**Auto-generated YouTube Thumbnails:**
For YouTube videos, you can use:
```
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```
Replace VIDEO_ID with your YouTube video ID.

---

## Blog Featured Images

### Option 1: Upload from Computer (NEW!)
1. Go to Admin Dashboard → Blogs
2. Click "Add New Blog" or edit existing blog
3. Scroll to "Featured Image" section
4. Click "Choose File" button
5. Select image from your computer
6. Wait for "✓ Image uploaded" confirmation
7. Preview appears below
8. Save the blog

### Option 2: Use URL
1. Paste image URL in "Image URL" field
2. Save

---

## Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP
- Any standard web image format

## Image Best Practices

### For Video Thumbnails:
- **Recommended size:** 1280x720 pixels (16:9 ratio)
- **File size:** Under 2MB
- **Format:** JPG or PNG
- **Content:** Clear, relevant preview of video content

### For Blog Images:
- **Recommended size:** 1200x630 pixels (good for social sharing)
- **File size:** Under 3MB
- **Format:** JPG or PNG
- **Content:** Relevant to blog topic

---

## Where Images Are Stored

### Local Storage (Current):
```
/app/backend/uploads/
```

Images are accessible at:
```
https://vertex-lab.preview.emergentagent.com/uploads/filename.jpg
```

### View Uploaded Files:
```bash
ls -lh /app/backend/uploads/
```

---

## Troubleshooting

### "Failed to upload image"
- Check file size (should be under 10MB)
- Check file format (must be image)
- Check internet connection
- Try a different image

### Image not showing
- Refresh the page
- Check if URL is correct
- Verify file was uploaded successfully
- Check browser console for errors

### Upload is slow
- Large file size - compress image first
- Slow internet connection
- Server might be processing

---

## Tips

1. **Compress images** before uploading using:
   - TinyPNG.com
   - Squoosh.app
   - ImageOptim (Mac)

2. **Use descriptive filenames:**
   - Good: `transfer-pricing-guide-2024.jpg`
   - Bad: `IMG_1234.jpg`

3. **Preview before uploading:**
   - Check image looks good
   - Verify correct aspect ratio
   - Ensure text is readable

4. **Reuse images:**
   - After uploading, copy the generated URL
   - Use same URL for multiple items if needed
   - Saves storage space

---

## Advanced: Using External Image Hosts

You can also host images on:
- **Imgur** - Free image hosting
- **Cloudinary** - CDN with optimization
- **AWS S3** - Professional storage
- **Unsplash** - Free stock photos

Just paste the image URL in the URL field instead of uploading.

---

## Example Workflow

### Adding Video with Custom Thumbnail:
1. Login to admin
2. Videos → Add New Video
3. Fill title, description, category
4. For YouTube: paste video ID
5. **Upload thumbnail:**
   - Click "Choose File"
   - Select image (e.g., `video-cover.jpg`)
   - Wait for upload
6. Click "Create Video"
7. Done! ✅

Your video now has a custom thumbnail visible on the public site!
