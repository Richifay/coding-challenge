export const challenge = {
  id: "tdi-coding-challenge",
  
  title: "3D TDI DB Logo Generator ",
  description:"Take the DB Logo to the next dimension with a litle twist 🧊🌪️",
  goal: "Write a program that generates and prints the logo (shown in the example) based on two integer inputs.",
  input: "Two non-negative integers a,b provided as a single line in the format \"a,b\".",
  output: "On success: print only the logo (no extra text).\nOn error: print exactly \"Error\" (capital E, the rest lowercase) and nothing else.",
  hintItems: [
    {
      id: "free",
      title: "Free Hint",
      summary: "Some tips to get started",
      costMin: 0,
      detail: "Think about these questions:\nWhat is the meaning of the numbers?\nWhat happens for \"6,0\"?\nWhat happens for \"8,4\"?\nFor which input(s) an error should occur?\nExtra hint: An error should also occour if the Logo does not look like a DB Logo.",
    },
    {
      id: "meaning-of-the-numbers",
      title: "Meaning of the Inputs",
      summary: "What does the numbers mean?",
      costMin: 1,
      detail: "The first number describes the width and height of the 2D logo. (The X and Y axis)\nThe second number describes the depth of the Logo starting from 0. (The Z axis)\nIf the depth is 0, the logo will be printed only 2D.\nExtra hint: The total number of lines beeing printed is equal to the sum of the two numbers.",
    },
    {
      id: "how-to-read-inputs",
      title: "How to read inputs",
      summary: "How do I read the inputs in Java or Python?",
      costMin: 2,
      detail: "In Java, you can read the input using the BufferedReader class. \nIn Python, you can read the input using the input() function.",
      java: `BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String input = br.readLine().trim();
String[] parts = input.split(",");
a = Integer.parseInt(parts[0].trim());
b = Integer.parseInt(parts[1].trim());`,
      python: `raw = input().strip()
parts = raw.split(',')
a = int(parts[0].strip())
b = int(parts[1].strip())`,
    },
    {
      id: "error-scenarios",
      title: "What are the error scenarios?",
      summary: "For which input(s) an error should occur?",
      costMin: 1,
      detail: "These are these error scenarios:\n1. There are more or less than two input numbers.\n2. The input does not provide integer(s).\n3. One of the number is negative.\n4. The first number is smaller than 6 (Because it's not looking like a DB Logo in that case).",
    },
    {
      id: "error-handling",
      title: "Error handling",
      summary: "Implementation details for error handling",
      costMin: 5,
      detail: "You can use a try and catch block for handling the most errors.\nAlso check if the first number is larger than 5 and the second number is not negative.",
      java: `try {
  // read the input
  // check if two elements are provided in the input array
  if (parts.length != 2) { System.out.print("Error"); return; }
  //parse the elements as integers from input array
  if (a < 6 || b < 0) { System.out.print("Error"); return; }
  // continue with the implementation
} catch (Exception e) {
  System.out.println("Error");
}`,
      python: `try:
  # read the input
  # check if two elements are provided in the input array
  if len(parts) != 2:
    print('Error')
    return
  # parse the elements as integers from input array
  if a < 6 or b < 0:
    print('Error')
    return
  # continue with the implementation
except:
  print('Error')`,
    },
    {
      id: "code-structure",
      title: "How to structure your code",
      summary: "A rocket start for your code",
      costMin: 1,
      detail: "Here is how you can structure the code to print the logo.\nYou can split up the logo into two parts:\n1. The top part (number of lines equals to the depth)\n2. The bottom part (number of lines equals to the height)",
      java: `import java.io.*;
public class Main {
  private static void printTop() {}

  private static void printBottom() {}
  
  public static void main(String[] args) throws Exception {
    //read input and error handling
    printTop();
    printBottom();    
  }
}`,
python: `from itertools import cycle

def printTop():
  pass

def printBottom():
  pass

def solve():
  # define inputs globally
  global a,b
  # read the input and error handling
  printTop()
  printBottom()

if __name__ == "__main__":
  solve()`  
    },
    {
      id: "tdi-iterator",
      title: "TDI Iterator",
      summary: "How to Iterate between T, D and I",
      costMin: 3,
      detail: "You can use a simple iterator to iterate between T, D and I.",
      java: `private static final char[] TOKENS = {'T', 'D', 'I'};
private static int tokenIdx = 0;
private static String nextLetter() {
  char c = TOKENS[tokenIdx];
  tokenIdx = (tokenIdx + 1) % TOKENS.length;
  return Character.toString(c);
}`,
      python: `from itertools import cycle
letters_iterator = cycle("TDI")
def nextLetter():
  return next(letters_iterator)`
    },
    {
      id: "first-part-of-the-logo",
      title: "Printing the first part of the logo",
      summary: "Breaking down how to print the first part of the logo",
      costMin: 6,
      detail: "To print the first part of the logo (Top part),\nwe need to create a loop that prints the characters based on the number of lines.\n",
      java: `private static void printTop() {
  int emptySpacesOffset = 1;
  for (int line = 0; line < secondInput; line++) {
    StringBuilder out = new StringBuilder();
    // spaces before the first letter
    printSpacesOf(out, secondInput - line);
      
    if (line == 0) {
      // on the first line print full line e.g. T D I T D I
      printLetterOf(out, firstInput);
    } else {
      // print two letters with empty positions in between e.g. T * * * * I
      printTwoLettersWithVoid(out);
      // spaces between the two letters and the last letter
      printSpacesOf(out, line - emptySpacesOffset);
      printNextLetter(out);
    }
    if (line > firstInput - 2){
      emptySpacesOffset++;
    }
    System.out.println(out);
  }
}`,
      python: `def printTop():
  emptySpacesOffset = 1
  for line in range(secondInput):
    # spaces before the first letter
    printSpacesOf(secondInput - line)
    if line == 0:
      # on the first line print full line e.g. T D I T D I
      printLettersOf(firstInput)
    else:
      # print two letters with empty positions in between e.g. T * * * * I
      printTwoLettersWithVoid()
      # spaces between the two letters and the last letter
      printSpacesOf(line - emptySpacesOffset)
      printNextLetter()
    if line > firstInput - 2:
      emptySpacesOffset += 1
    print('')`,
    },
    {
      id: "second-part-of-the-logo",
      title: "Printing the second part of the logo",
      summary: "Breaking down how to print the second part of the logo",
      costMin: 8,
      detail: "To print the second part of the logo (Bottom part),\nwe need to create a loop that prints the characters based on the number of lines.\n",
      java: `private static void printBottom() {
  int emptySpacesBetweenTheLastLetter = (b < a ? b : a) - 1;
  for (int line = 0; line < a; line++) {
    StringBuilder out = new StringBuilder();
    if (line == 0 || line == (a - 1)) {
      // print full line e.g. T D I T D I"
      printLettersOf(out, a);
    } else if (line >= 2 && line <= (a - 3)) {
      // print line for the dash / e.g. T * D * * I
      printThreeLettersForDash(out, line);
    } else {
      //print two letter with empty positions in between e.g. T * * * * D
      printTwoLettersWithVoid(out);
    }
      //print the last letter with empty positions
      if(line < a - 1  && b > 0) { 
        if ((a - line - b) <= 0) {
          emptySpacesBetweenTheLastLetter--;
        }  
        printSpacesOf(out, emptySpacesBetweenTheLastLetter);
        printNextLetterWithSpace(out);
      }
    System.out.println(out);
  }
}`,
      python: `def printBottom():
  emptySpacesBetweenTheLastLetter = (b if b < a else a) - 1
  for line in range(a):
    if line == 0 or line == (a - 1):
      # print full line e.g. T D I T D I"
      printLettersOf(a)
    elif 2 <= line <= (a - 3):
      # print line for the dash / e.g. T * D * * I"
      printThreeLettersForDash(line)
    else:
      # print two letter with empty positions in between e.g. T * * * * D
      printTwoLettersWithVoid()
    if line < a - 1 and b > 0:
      if (a - line - b) <= 0:
        emptySpacesBetweenTheLastLetter -= 1
      printSpacesOf(emptySpacesBetweenTheLastLetter)
      printNextLetterWithSpace()
    print('')`,
    },
    {
      id: "useful-functions",
      title: "Some useful functions to print the logo",
      summary: "Some static functions to get to the solution",
      costMin: 3,
      detail: "I'll provide you some usefull functions to print the logo.",
      java: `private static void printTwoSpaces(StringBuilder out) {
  out.append(' ').append(' ');
}

private static void printNextLetterWithSpace(StringBuilder out) {
  out.append(nextLetter()).append(' ');
}

private static void printSpaces(StringBuilder out, int numberOfEmptyPositions) {
  for (int i = 0; i < numberOfEmptyPositions; i++) {
    printTwoSpaces(out);
  }
}

private static void printLetters(StringBuilder out, int numberOfLetters) {
  for (int i = 0; i < numberOfLetters; i++) {
    printNextLetterWithSpace(out);
  }
}

private static void printTwoLettersWithGap(StringBuilder out) {
  printNextLetterWithSpace(out);
  printSpaces(out, firstInput - 2);
  printNextLetterWithSpace(out);
}

private static void printThreeLettersForDash(StringBuilder out, int i){
  printNextLetterWithSpace(out);
  printSpaces(out, firstInput - i - 2 );
  printNextLetterWithSpace(out);
  printSpaces(out, i - 1);
  printNextLetterWithSpace(out);
}`,
python: `def printTwoSpaces():
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
  printSpaces(firstInput - 2)
  printNextLetterWithSpace()

def printThreeLettersForDash(i):
  printNextLetterWithSpace()
  printSpaces(firstInput - i - 2)
  printNextLetterWithSpace()
  printSpaces(i - 1)
  printNextLetterWithSpace()`
    },
    {
      id: "the-secret",
      title: "Secret 🤫",
      summary: "A secret that you shouldn't tell anyone",
      costMin: 2,
      detail: "You can use AI, I dont care, I build the challenge AI-Proof.",
    },
  ],
  examples: [
    { input: "6,2", image: "/image001.png" },
    { input: "7,4", image: "/image002a.png" }
  ],
  starterCodes: {
    python: `def solve():
# TODO: implement
    pass

if __name__ == "__main__":
    solve()
`,
    java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        // TODO: implement using input 'line'
        System.out.print("");
    }
}
`
  },
  tests: [
    { input: "6,2\n", expected: "    T D I T D I \n  T         D I \nT D I T D I   T \nD         I   T \nD     I   T   D \nI   T     D   I \nT         D I   \nT D I T D I     " },
    { input: "7,3\n", expected: "      T D I T D I T \n    D           I T \n  D           I   T \nD I T D I T D     I \nT           D     I \nT       D   I     T \nD     I     T     D \nI   T       D   I    \nT           D I      \nT D I T D I T       " },
    { input: "8,4\n", expected: "        T D I T D I T D \n      I             T D \n    I             T   D \n  I             T     D \nI T D I T D I T       D \nI             T       D \nI         T   D       I \nT       D     I       T \nD     I       T     D    \nI   T         D   I      \nT             D I        \nT D I T D I T D         " },
    { input: "6,0\n", expected: "T D I T D I \nT         D \nI     T   D \nI   T     D \nI         T \nD I T D I T " },
    { input: "9,0\n", expected: "T D I T D I T D I \nT               D \nI           T   D \nI         T     D \nI       T       D \nI     T         D \nI   T           D \nI               T \nD I T D I T D I T " },
    { input: "7,1\n", expected: "  T D I T D I T \nD I T D I T D I \nT           D I \nT       D   I T \nD     I     T D \nI   T       D I \nT           D I \nT D I T D I T   " },
    { input: "5,0\n", expected: "Error" },
    { input: "8\n", expected: "Error" },
    { input: "-8,0\n", expected: "Error" },
    { input: "A\n", expected: "Error" },
    { input: "8 1\n", expected: "Error" },
    { input: "8.2,1\n", expected: "Error" }
  ]
};
