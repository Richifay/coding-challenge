export const challenge = {
  id: "tdi-coding-challenge",
  
  title: "3D TDI DB Logo Generator ",
  description:"Take the DB Logo to the next dimension with a litle twist",
  goal: "Write a program that generates and prints the logo (shown in the example) based on two integer inputs.",
  input: "Two non-negative integers a,b provided as a single line in the format \"a,b\". \n The predefined input which is passed to the editor is: \"6,2\".",
  output: "On success: print only the logo (no extra text).\nOn error: print exactly \"Error\" (capital E, the rest lowercase) and nothing else.",
  hints: "Think about these questions:\nWhat is the meaning of the numbers?\nWhat happens for \"6,0\"?\nWhat happens for \"8,4\"?\nFor which input(s) an error should occur?",
  examples: [
    { input: "6,2", image: "/image001.png" },
    { input: "7,4", image: "/image002.png" }
  ],
  predefinedInput: "6,2\n",
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
