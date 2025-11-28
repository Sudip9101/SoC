$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Write-Host "Testing registration API with body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
} 