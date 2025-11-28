# Test Password Hashing Fix
Write-Host "🧪 Testing Password Hashing Fix..." -ForegroundColor Yellow

# Test 1: Register a new user
Write-Host "`n1️⃣  Testing Registration with bcrypt hashing..." -ForegroundColor Cyan
$registerBody = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "TestPassword123"
    confirmPassword = "TestPassword123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user.userId)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Test 2: Login with the same user
Write-Host "`n2️⃣  Testing Login with bcrypt verification..." -ForegroundColor Cyan
$loginBody = @{
    email = "testuser@example.com"
    password = "TestPassword123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Test 3: Try login with wrong password
Write-Host "`n3️⃣  Testing Login with wrong password..." -ForegroundColor Cyan
$wrongPasswordBody = @{
    email = "testuser@example.com"
    password = "WrongPassword123"
} | ConvertTo-Json

try {
    $wrongResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $wrongPasswordBody -ContentType "application/json"
    Write-Host "❌ This should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected wrong password!" -ForegroundColor Green
}

# Test 4: Try login with existing mock user
Write-Host "`n4️⃣  Testing Login with mock user (test@example.com / password123)..." -ForegroundColor Cyan
$mockUserBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $mockResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $mockUserBody -ContentType "application/json"
    Write-Host "✅ Mock user login successful!" -ForegroundColor Green
    Write-Host "Token: $($mockResponse.token)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Mock user login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Password hashing test completed!" -ForegroundColor Yellow 