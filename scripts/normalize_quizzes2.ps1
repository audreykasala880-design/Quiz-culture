$files = @(
  'c:\Users\MUKSOFT\Documents\quiz culture\drama-quiz.html',
  'c:\Users\MUKSOFT\Documents\quiz culture\cinema-quiz.html'
)

foreach ($file in $files) {
  Write-Host "Processing $file"
  $content = Get-Content -Raw -LiteralPath $file
  $pattern = [regex]::new('options\s*:\s*\[(?<opts>.*?)\]\s*,\s*correct\s*:\s*(?<num>\d+)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $matches = $pattern.Matches($content)
  if ($matches.Count -eq 0) { Write-Host "No numeric correct entries found in $file"; continue }
  foreach ($m in $matches) {
    $full = $m.Value
    $optsRaw = $m.Groups['opts'].Value
    $num = [int]$m.Groups['num'].Value
    # extract double-quoted option strings
    $optRegex = [regex] '"([^"]*)"'
    $optMatches = $optRegex.Matches($optsRaw)
    $opts = @()
    foreach ($om in $optMatches) { $opts += $om.Groups[1].Value }
    if ($opts.Count -gt 0) {
      $idx = $num
      if ($num -ge 1 -and $num -le $opts.Count) { $idx = $num - 1 }
      if ($idx -ge 0 -and $idx -lt $opts.Count) {
        $correctText = $opts[$idx]
        $escaped = $correctText -replace '"', '"'
        $newFull = ($full -replace 'correct\s*:\s*\d+', "correct: \"$escaped\"")
        $content = $content.Replace($full, $newFull)
        Write-Host "Replaced numeric correct ($num) with '$correctText'"
      }
    }
  }
  Set-Content -LiteralPath $file -Value $content -Encoding UTF8
  Write-Host "Updated file: $file"
}
