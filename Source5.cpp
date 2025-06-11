#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
    int np, pid;
    MPI_Init(NULL, NULL);
    MPI_Comm_size(MPI_COMM_WORLD, &np);
    MPI_Comm_rank(MPI_COMM_WORLD, &pid);

    char arr1[64];
    int Total = 0;

    if (pid == 0) {
        arr1[0] = 'W'; arr1[1] = 'W'; arr1[2] = 'W'; arr1[3] = 'W'; arr1[4] = 'B'; arr1[5] = 'B'; arr1[6] = 'B'; arr1[7] = 'W';
        arr1[8] = 'W'; arr1[9] = 'B'; arr1[10] = 'B'; arr1[11] = 'B'; arr1[12] = 'W'; arr1[13] = 'W'; arr1[14] = 'B'; arr1[15] = 'B';
        arr1[16] = 'W'; arr1[17] = 'B'; arr1[18] = 'B'; arr1[19] = 'W'; arr1[20] = 'B'; arr1[21] = 'B'; arr1[22] = 'W'; arr1[23] = 'W';
        arr1[24] = 'W'; arr1[25] = 'W'; arr1[26] = 'W'; arr1[27] = 'B'; arr1[28] = 'B'; arr1[29] = 'B'; arr1[30] = 'B'; arr1[31] = 'W';
        arr1[32] = 'W'; arr1[33] = 'W'; arr1[34] = 'B'; arr1[35] = 'B'; arr1[36] = 'W'; arr1[37] = 'B'; arr1[38] = 'B'; arr1[39] = 'W';
        arr1[40] = 'W'; arr1[41] = 'B'; arr1[42] = 'B'; arr1[43] = 'B'; arr1[44] = 'B'; arr1[45] = 'W'; arr1[46] = 'W'; arr1[47] = 'W';
        arr1[48] = 'W'; arr1[49] = 'W'; arr1[50] = 'W'; arr1[51] = 'W'; arr1[52] = 'B'; arr1[53] = 'B'; arr1[54] = 'B'; arr1[55] = 'W';
        arr1[56] = 'W'; arr1[57] = 'W'; arr1[58] = 'B'; arr1[59] = 'B'; arr1[60] = 'B'; arr1[61] = 'B'; arr1[62] = 'W'; arr1[63] = 'W';
    }

    char recvarr[8];
    MPI_Scatter(&arr1, 8, MPI_CHAR, &recvarr, 8, MPI_CHAR, 0, MPI_COMM_WORLD);

    printf("My processor id is %d. Received Data is: ", pid);
    for (int i = 0; i < 8; i++) {
        printf("%c", recvarr[i]);
    }
    printf("\n");

    int blackCounter = 0, whiteCounter = 0;
    char encodedstring[16] = { ' ' };
    int j = 0;

    for (int i = 0; i < 8; i++) {
        if (recvarr[i] == 'W') {
            if (blackCounter > 0) {
                encodedstring[j++] = '0' + blackCounter;
                encodedstring[j++] = 'B';
                blackCounter = 0;
            }
            whiteCounter++;
        }
        else {
            if (whiteCounter > 0) {
                encodedstring[j++] = '0' + whiteCounter;
                encodedstring[j++] = 'W';
                whiteCounter = 0;
            }
            blackCounter++;
        }
    }

    if (blackCounter > 0) {
        encodedstring[j++] = '0' + blackCounter;
        encodedstring[j++] = 'B';
    }
    if (whiteCounter > 0) {
        encodedstring[j++] = '0' + whiteCounter;
        encodedstring[j++] = 'W';
    }

    printf("At pid: %d Encoded String: ", pid);
    for (int i = 0; i < 16; i++) {
        if (encodedstring[i] != ' ') {
            printf("%c", encodedstring[i]);
        }
    }
    printf("\n");

    char encoded[8][16];
    MPI_Gather(&encodedstring, 16, MPI_CHAR, &encoded, 16, MPI_CHAR, 0, MPI_COMM_WORLD);

    if (pid == 0) {
        for (int j = 0; j < 8; j++) {
            printf("\nFrom pid: %d Encoded String: ", j);
            for (int i = 0; i < 16; i++) {
                if (encoded[j][i] != ' ') {
                    printf("%c", encoded[j][i]);
                }
            }
            printf("\n");
        }
    }

    MPI_Finalize();
    return 0;
}
