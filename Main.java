import java.io.*;

public class Main {
    private static final char[] TOKENS = {'T', 'D', 'I'};
    private static int tokenIdx = 0;

    private static int height; // equals to width 
    private static int depth;

    private static String nextLetter() {
        char c = TOKENS[tokenIdx];
        tokenIdx = (tokenIdx + 1) % TOKENS.length;
        return Character.toString(c);
    }

    private static void printTwoSpaces(StringBuilder out) {
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
        printSpaces(out, height - 2);
        printNextLetterWithSpace(out);
    }

    private static void printThreeLettersForDash(StringBuilder out, int i){
        printNextLetterWithSpace(out);
        printSpaces(out, height - i - 2 );
        printNextLetterWithSpace(out);
        printSpaces(out, i - 1);
        printNextLetterWithSpace(out);
    }

    private static void printTop() {
        int emptySpacesOffset = 1;
        for (int line = 0; line < depth; line++) {
            StringBuilder out = new StringBuilder();
            //print spaces for the empty positions before the first letter
            printSpaces(out, depth - line);
            if (line == 0) {
                //on the first line print full line e.g. T D I T D I"
                printLetters(out, height);
            } else {
                //print two letters with empty positions in between e.g. T * * * * I"
                printTwoLettersWithGap(out);
                //print spaces for the empty positions in between the two letters
                printSpaces(out, line - emptySpacesOffset);
                //print the next letter
                printNextLetterWithSpace(out);
            }
            //if the line is greater than the height - 2, increment the empty spaces offset
            if (line > height - 2){
                emptySpacesOffset++;
            }
            System.out.println(out);
        }
    }

    private static void printBottom() {
        int emptySpacesBetweenTheLastLetter = (depth < height ? depth : height) - 1;
        for (int line = 0; line < height; line++) {
            StringBuilder out = new StringBuilder();

            if (line == 0 || line == (height - 1)) {
                //print full line e.g. T D I T D I"
                printLetters(out, height);
            } else if (line >= 2 && line <= (height - 3)) {
                //print line for the dash / e.g. T * I * * I"
                printThreeLettersForDash(out, line);
            } else {
                //print two letter with empty positions (height - 2) in between e.g. T * * * * I"
                printTwoLettersWithGap(out);
            }
            
            //print the last letter with empty positions
            if(line < height - 1  && depth > 0) { 
                if ((height - line - depth) <= 0) {
                    emptySpacesBetweenTheLastLetter--;
                }
                printSpaces(out, emptySpacesBetweenTheLastLetter);
                printNextLetterWithSpace(out);
            }
            System.out.println(out);
        }
    }

    public static void main(String[] args) throws Exception {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String input = br.readLine().trim();
            String[] parts = input.split(",");
            if (parts.length != 2) { System.out.print("Error"); return; }
            height = Integer.parseInt(parts[0].trim());
            depth = Integer.parseInt(parts[1].trim());
            if (height < 6 || depth < 0) { System.out.print("Error"); return; }
            // top section
            printTop();

            // bottom section
            printBottom();    
        } catch (Exception e) {
            System.out.println("Error");
        }
    }
}