#!/bin/bash

# SEO & Mobile Optimization Verification Script
# Run this to validate all SEO endpoints are working

BASE_URL="${1:-http://localhost:3001}"
echo "🔍 Checking SEO Endpoints at: $BASE_URL"
echo "=================================================="

# Check robots.txt
echo ""
echo "1️⃣  Checking /robots.txt..."
if curl -s "$BASE_URL/robots.txt" | grep -q "Sitemap:"; then
    echo "   ✅ robots.txt is served correctly"
    echo "   📋 Content preview:"
    curl -s "$BASE_URL/robots.txt" | head -5
else
    echo "   ❌ robots.txt not found or invalid"
fi

# Check sitemap.xml
echo ""
echo "2️⃣  Checking /sitemap.xml..."
if curl -s "$BASE_URL/sitemap.xml" | grep -q "<?xml"; then
    echo "   ✅ sitemap.xml is valid XML"
    echo "   📊 URL count:"
    curl -s "$BASE_URL/sitemap.xml" | grep -c "<url>" || echo "0"
else
    echo "   ❌ sitemap.xml not found or invalid XML"
fi

# Check sitemap index HTML
echo ""
echo "3️⃣  Checking /sitemap-index.html..."
if curl -s "$BASE_URL/sitemap-index.html" | grep -q "Meum Diarium"; then
    echo "   ✅ sitemap-index.html is accessible"
else
    echo "   ❌ sitemap-index.html not found"
fi

# Check build output
echo ""
echo "4️⃣  Checking build artifacts..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "   ✅ Production build exists"
    if grep -q "meum-diarium.xn--schchner-2za.de" dist/index.html; then
        echo "   ✅ Correct domain in index.html"
    else
        echo "   ⚠️  Domain might not be correct in index.html"
    fi
    
    if grep -q "canonical" dist/index.html; then
        echo "   ✅ Canonical tag present"
    else
        echo "   ⚠️  Canonical tag missing"
    fi
else
    echo "   ❌ Production build not found (run: npm run build)"
fi

# Check internal pages
echo ""
echo "4️⃣  Checking internal pages..."
PAGES=("/timeline" "/caesar" "/cicero")
for PAGE in "${PAGES[@]}"; do
    echo "   🔍 Checking $PAGE..."
    CONTENT=$(curl -s "$BASE_URL$PAGE")
    if echo "$CONTENT" | grep -q "rel=\"canonical\""; then
        echo "      ✅ Canonical tag present"
    else
        echo "      ❌ Missing canonical tag"
    fi
    
    if echo "$CONTENT" | grep -q "property=\"og:image\""; then
        echo "      ✅ Social image present"
    else
        echo "      ❌ Missing social image"
    fi
done

# Check build artifacts (if dist exists)
if [ -d "dist" ]; then
    echo ""
    echo "5️⃣  Checking build artifacts (dist)..."
    
    # Check for alt tags on images
    MISSING_ALT=$(grep -r "<img" dist --exclude-dir=node_modules | grep -v "alt=" | wc -l)
    if [ "$MISSING_ALT" -eq 0 ]; then
        echo "   ✅ All images in dist have alt attributes"
    else
        echo "   ⚠️ Found $MISSING_ALT images without alt attributes in dist"
    fi

    # Check for title/meta length across html files
    echo "   📏 Checking meta lengths..."
    for f in $(find dist -name "*.html"); do
        TITLE_LEN=$(grep -o "<title>[^<]*</title>" "$f" | sed 's/<title>//;s/<\/title>//' | wc -c)
        DESC_LEN=$(grep -o "<meta name=\"description\" content=\"[^\"]*\"" "$f" | sed 's/.*content="//;s/"//' | wc -c)
        
        if [ "$TITLE_LEN" -gt 60 ]; then echo "      ⚠️  $f: Title too long ($TITLE_LEN chars)"; fi
        if [ "$DESC_LEN" -gt 160 ]; then echo "      ⚠️  $f: Description too long ($DESC_LEN chars)"; fi
    done
fi

echo ""
echo "=================================================="
echo "🎯 Verification complete!"
echo ""
echo "📌 Next Steps:"
echo "   1. Deploy to https://meum-diarium.xn--schchner-2za.de/"
echo "   2. Submit sitemap to Google Search Console"
echo "   3. Submit sitemap to Bing Webmaster Tools"
echo "   4. Check PageSpeed Insights"
echo "   5. Monitor Core Web Vitals"
echo ""
