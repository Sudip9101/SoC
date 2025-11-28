# Test Contact Form API
$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject from PowerShell"
    message = "This is a test message to verify the contact form is working."
} | ConvertTo-Json

Write-Host "Testing Contact Form API..." -ForegroundColor Yellow
Write-Host "Request Body: $body" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
} 