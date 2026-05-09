# Sri Sai Mosquito Enterprises - Startup Script
# Run both backend and frontend with one click

param(
    [switch]$Build,
    [switch]$OnlyBackend,
    [switch]$OnlyFrontend
)

$ErrorActionPreference = "Continue"

# Colors for output
function Write-Colored {
    param($Message, $Color = "White")
    $colors = @{
        "Red" = "`e[31m"
        "Green" = "`e[32m"
        "Yellow" = "`e[33m"
        "Cyan" = "`e[36m"
        "White" = "`e[37m"
    }
    Write-Host "$($colors[$Color])[$(Get-Date -Format 'HH:mm:ss')] $Message`e[0m"
}

$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

Write-Colored "========================================" "Cyan"
Write-Colored "  Sri Sai Mosquito Enterprises" "Cyan"
Write-Colored "  Starting Application..." "Cyan"
Write-Colored "========================================`n" "Cyan"

# Set Java environment
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
$env:PATH = "C:\Program Files\Java\jdk-21.0.10\bin;C:\Program Files\apache-maven-3.9.15\bin;$env:PATH"

if ($Build) {
    Write-Colored "Building backend..." "Yellow"
    Set-Location "$ProjectRoot\backend"
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) { 
        Write-Colored "Backend build failed!" "Red"
        exit 1 
    }
    Write-Colored "Backend built successfully!" "Green"
    
    Write-Colored "Building frontend..." "Yellow"
    Set-Location "$ProjectRoot\frontend"
    npm install
    npm run build
    if ($LASTEXITCODE -ne 0) { 
        Write-Colored "Frontend build failed!" "Red"
        exit 1 
    }
    Write-Colored "Frontend built successfully!" "Green"
}

# Start Backend
if (-not $OnlyFrontend) {
    Write-Colored "Starting Backend (Spring Boot on port 8080)..." "Yellow"
    Set-Location "$ProjectRoot\backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "
        `$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.10'
        `$env:PATH = 'C:\Program Files\Java\jdk-21.0.10\bin;C:\Program Files\apache-maven-3.9.15\bin;`$env:PATH'
        cd '$ProjectRoot\backend'
        mvn spring-boot:run
    " -WindowStyle Normal
}

# Start Frontend
if (-not $OnlyBackend) {
    Write-Colored "Starting Frontend (React on port 3000)..." "Yellow"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "
        cd '$ProjectRoot\frontend'
        npm start
    " -WindowStyle Normal
}

Write-Colored "`n========================================" "Cyan"
Write-Colored "  Application Started!" "Green"
Write-Colored "  Backend: http://localhost:8080/api" "White"
Write-Colored "  Frontend: http://localhost:3000" "White"
Write-Colored "========================================`n" "Cyan"

Write-Colored "Press Ctrl+C to stop all servers..." "Yellow"
Read-Host