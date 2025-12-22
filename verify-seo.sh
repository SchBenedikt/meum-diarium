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

# Check SEO files
echo ""
echo "5️⃣  Checking SEO documentation..."
if [ -f "SEO_MOBILE_OPTIMIZATION.md" ]; then
    echo "   ✅ SEO documentation exists"
else
    echo "   ❌ SEO_MOBILE_OPTIMIZATION.md not found"
fi

if [ -f "public/.htaccess" ]; then
    echo "   ✅ .htaccess configuration exists"
else
    echo "   ⚠️  .htaccess not found (may not be deployed)"
fi

# Summary
echo ""
echo "=================================================="
echo "✅ SEO Optimization Check Complete!"
echo ""
echo "📌 Next Steps:"
echo "   1. Deploy to https://meum-diarium.xn--schchner-2za.de/"
echo "   2. Submit sitemap to Google Search Console"
echo "   3. Submit sitemap to Bing Webmaster Tools"
echo "   4. Check PageSpeed Insights"
echo "   5. Monitor Core Web Vitals"
echo ""
