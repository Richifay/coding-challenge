from itertools import cycle
height = 0 #equals to width
depth = 0
letters_iterator = cycle("TDI")
def nextLetter():
    return next(letters_iterator)

def printTwoSpaces():
    print(' ', end=' ')

def printNextLetterWithSpace():
    print(nextLetter(), end=' ')

def printSpaces(numberOfEmptyPositions):
    for _ in range(numberOfEmptyPositions):
        printTwoSpaces()

def printLetters(numberOfLetters):
    for _ in range(numberOfLetters):
        printNextLetterWithSpace()

def printTwoLettersWithGap():
    printNextLetterWithSpace()
    printSpaces(height - 2)
    printNextLetterWithSpace()

def printThreeLettersForDash(i):
    printNextLetterWithSpace()
    printSpaces(height - i - 2)
    printNextLetterWithSpace()
    printSpaces(i - 1)
    printNextLetterWithSpace()

def printTop():
    emptySpacesOffset = 1
    for line in range(depth):
        # spaces before the first letter
        printSpaces(depth - line)
        if line == 0:
            # full line of letters
            printLetters(height)
        else:
            # two letters with a gap in between
            printTwoLettersWithGap()
            # spaces between the two letters and the last letter
            printSpaces(line - emptySpacesOffset)
            # final letter
            printNextLetterWithSpace()
        if line > height - 2:
            emptySpacesOffset += 1
        print('')


def printBottom():
    emptySpacesBetweenTheLastLetter = (depth if depth < height else height) - 1
    for line in range(height):
        if line == 0 or line == (height - 1):
            # print full line e.g. T D I T D I"
            printLetters(height)
        elif 2 <= line <= (height - 3):
            # print line for the dash / e.g. T * I * * I"
            printThreeLettersForDash(line)
        else:
            # two letters with a gap in between
            printTwoLettersWithGap()

        if line < height - 1 and depth > 0:
            if (height - line - depth) <= 0:
                emptySpacesBetweenTheLastLetter -= 1
            printSpaces(emptySpacesBetweenTheLastLetter)
            printNextLetterWithSpace()
        print('')

def solve():
    global height, depth
    try:
        raw = input().strip()
        parts = raw.split(',')
        if len(parts) != 2:
            print('Error')
            return
        height = int(parts[0].strip())
        depth = int(parts[1].strip())
        if height < 6 or depth < 0:
            print('Error')
            return
        printTop()
        printBottom()
    except:
        print('Error')

if __name__ == "__main__":
    solve()