
from itertools import cycle

 

letters_iterator = cycle("TDI")
 

def nl():

    return next(letters_iterator)

 

def full():

    for _ in range(h):

        print(nl() + " ", end="")

 

def half(i):

    print(nl() + " ", end="")

    for j in range(h - 2):

        if j + 1 >= 2 and j + 1 <= (h - 3):

            if j == (h - i - 2):

                print(nl() + " ", end="")

            else:

                print("  ", end="")

        else:

            print("  ", end="")

    print(nl() + " ", end="")

 

def empty():

    print(nl() + " ", end="")

    for _ in range(h - 2):

        print("  ", end="")

    print(nl() + " ", end="")


try:
    input = input()
    hs, ss = input.split(",")

    h = int(hs)

    s = int(ss)

    
    if (h<6):
        print("Error") 
    else:

    # top

        for i in range(s):

            for _ in range(s - i):

                print("  ", end="")

        

            if i == 0:   

                full()

        

            else:

                empty()

        

            for j in range(i):

                if j == (i - 1):

                    print(nl() + " ", end="")

                else:

                    print("  ", end="")

        

            print()

        

        # bottom

        for i in range(h):

            if i == 0 or i == (h - 1):

                full()

            elif i >= 2 and i <= (h - 3):

                half(i)

            else:

                empty()

        

            if (h - i - s) > 0:

                for j in range(s):

                    if j == (s - 1):

                        print(nl() + " ", end="")

                    else:

                        print("  ", end="")

            else:

                for j in range(s):

                    if j == (s + (h - i - s - 2)):

                        print(nl() + " ", end="")

                    else:

                        print("  ", end="")

        

            print()


except:
    print("Error")