"""Execute no terminal integrado para conferir as 16 cores ANSI."""
for name, first in (("Normal", 30), ("Bright", 90)):
    print(name)
    for index in range(8):
        print(f"\033[{first + index}m ANSI {first + index}: Velune 012345 \033[0m")
