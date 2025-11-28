$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "Test message"
} | ConvertTo-Json

Write-Host "Testing API with body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
} 