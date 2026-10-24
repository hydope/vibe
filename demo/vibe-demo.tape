# Real recording of the Vibe quickstart. Regenerate with: vhs demo/vibe-demo.tape
Output demo/vibe-demo.gif
Set Shell "bash"
Set FontSize 18
Set Width 1100
Set Height 560
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 45ms
Hide
Type "export PS1='$ ' && rm -rf ~/.vibe/runs && clear"
Enter
Show
Type "npx -y hydope/vibe demo"
Sleep 400ms
Enter
Wait+Screen@60s /Running/
Sleep 4s
Ctrl+C
Sleep 1500ms
