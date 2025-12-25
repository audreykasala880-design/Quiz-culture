$files = @(
  'c:\Users\MUKSOFT\Documents\quiz culture\anime-quiz.html',
  'c:\Users\MUKSOFT\Documents\quiz culture\culture-quiz.html',
  'c:\Users\MUKSOFT\Documents\quiz culture\drama-quiz.html',
  'c:\Users\MUKSOFT\Documents\quiz culture\cinema-quiz.html'
)

foreach ($file in $files) {
  try {
    $text = Get-Content -Raw -LiteralPath $file
    $regex = [regex] '\{(?<block>.*?options\s*:\s*\[(?<opts>.*?)\].*?correct\s*:\s*(?<num>\d+).*?)\}' , [System.Text.RegularExpressions.RegexOptions]::Singleline
    $newText = $text
    $changed = $false
    $matches = $regex.Matches($text)
    foreach ($m in $matches) {
      $block = $m.Groups['block'].Value
      $optsRaw = $m.Groups['opts'].Value
      $num = [int]$m.Groups['num'].Value
      # extract double-quoted strings
      $optRegex = [regex] '"([^"]*)"'
      $optMatches = $optRegex.Matches($optsRaw)
      $opts = @()
      foreach ($om in $optMatches) { $opts += $om.Groups[1].Value }
      if ($opts.Count -gt 0) {
        $idx = $num
        if ($num -ge 1 -and $num -le $opts.Count) { $idx = $num - 1 }
        if ($idx -ge 0 -and $idx -lt $opts.Count) {
          $correctText = $opts[$idx]
          $replacementBlock = $block -replace 'correct\s*:\s*\d+', "correct: \"$correctText\""
          $old = '{' + $block + '}'
          $new = '{' + $replacementBlock + '}'
          $newText = $newText.Replace($old, $new)
          $changed = $true
        }
      }
    }
    if ($changed) {
      Set-Content -LiteralPath $file -Value $newText -Encoding UTF8
      Write-Host "Updated $file"
    } else {
      Write-Host "No numeric correct entries found in $file"
    }
  } catch {
    Write-Host "Error processing $file : $_"
  }
}
