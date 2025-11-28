$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Testing login API with body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
} 