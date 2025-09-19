//This is the java solution for the coding challenge
import java.io.*;

public class Main {
    private static final char[] TOKENS = {'T', 'D', 'I'};
    private static int tokenIdx = 0;

    private static int h;
    private static int s;

    private static String nextLetter() {
        char c = TOKENS[tokenIdx];
        tokenIdx = (tokenIdx + 1) % TOKENS.length;
        return Character.toString(c);
    }

    private static void printNextWithSpace(StringBuilder out) {
        out.append(nextLetter()).append(' ');
    }

    private static void printTwoSpaces(StringBuilder out) {
        out.append(' ').append(' ');
    }

    private static void full(StringBuilder out) {
        for (int i = 0; i < h; i++) {
            printNextWithSpace(out);
        }
    }

    private static void empty(StringBuilder out) {
        printNextWithSpace(out);
        for (int i = 0; i < h - 2; i++) {
            printTwoSpaces(out);
        }
        printNextWithSpace(out);
    }

    private static void half(StringBuilder out, int i) {
        printNextWithSpace(out);
        for (int j = 0; j < h - 2; j++) {
            if (j + 1 >= 2 && j + 1 <= (h - 3)) {
                if (j == (h - i - 2)) {
                    printNextWithSpace(out);
                } else {
                    printTwoSpaces(out);
                }
            } else {
                printTwoSpaces(out);
            }
        }
        printNextWithSpace(out);
    }

    public static void main(String[] args) throws Exception {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String line = br.readLine();
            if (line == null) { System.out.print("Error"); return; }
            line = line.trim();
            String[] parts = line.split(",");
            if (parts.length != 2) { System.out.print("Error"); return; }
            h = Integer.parseInt(parts[0].trim());
            s = Integer.parseInt(parts[1].trim());

            if (h < 6) { System.out.print("Error"); return; }

            StringBuilder out = new StringBuilder();

            // top
            for (int i = 0; i < s; i++) {
                for (int k = 0; k < (s - i); k++) {
                    printTwoSpaces(out);
                }
                if (i == 0) {
                    full(out);
                } else {
                    empty(out);
                }
                for (int j = 0; j < i; j++) {
                    if (j == (i - 1)) {
                        printNextWithSpace(out);
                    } else {
                        printTwoSpaces(out);
                    }
                }
                out.append('\n');
            }

            // bottom
            for (int i = 0; i < h; i++) {
                if (i == 0 || i == (h - 1)) {
                    full(out);
                } else if (i >= 2 && i <= (h - 3)) {
                    half(out, i);
                } else {
                    empty(out);
                }

                if ((h - i - s) > 0) {
                    for (int j = 0; j < s; j++) {
                        if (j == (s - 1)) {
                            printNextWithSpace(out);
                        } else {
                            printTwoSpaces(out);
                        }
                    }
                } else {
                    for (int j = 0; j < s; j++) {
                        if (j == (s + (h - i - s - 2))) {
                            printNextWithSpace(out);
                        } else {
                            printTwoSpaces(out);
                        }
                    }
                }

                out.append('\n');
            }

            System.out.print(out.toString());
        } catch (Exception e) {
            System.out.print("Error");
        }
    }
}


