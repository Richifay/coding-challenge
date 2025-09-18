export const challenge = {
  id: "tdi-coding-challenge",
  title: "TDI Coding Challenge",
  description: "The result of the code should be a logo generator. \n  Your program should takes two number as input and prints the logo. \n What does these number means? \n What happens for 6,0? \n What happens for 8,4? \n  Think about Error scenarios. \n  The console should just display \"Error\" in these cases. \n The predefined input is \"6,2\"",
  examples: [
    { input: "6,2", image: "/image001.png" },
    { input: "7,3", image: "/image002.png" }
  ],
  predefinedInput: "6,2\n",
  starterCode: `def solve():
 #TODO: add you implementation here
    pass

if __name__ == "__main__":
    solve()
`,
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
