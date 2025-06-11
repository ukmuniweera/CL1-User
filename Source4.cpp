#include <mpi.h>
#include <stdio.h>

int main4() {
	int np;
	int pid;
	MPI_Init(NULL, NULL);
	MPI_Comm_size(MPI_COMM_WORLD, &np);
	MPI_Comm_rank(MPI_COMM_WORLD, &pid);
	int matrix[3][3];
	int vector[3];
	int valueArr[3];

	if (pid == 0) {
		matrix[0][0] = 1;
		matrix[0][1] = 2;
		matrix[0][2] = 3;
		matrix[1][0] = 2;
		matrix[1][1] = 1;
		matrix[1][2] = 1;
		matrix[2][0] = 4;
		matrix[2][1] = 2;
		matrix[2][2] = 3;

		vector[0] = 5;
		vector[1] = 6;
		vector[2] = 7;
	}

	int recvMatrix[3];
	MPI_Scatter(&matrix, 3, MPI_INT, recvMatrix, 3, MPI_INT, 0, MPI_COMM_WORLD);
	MPI_Bcast(&vector, 3, MPI_INT, 0, MPI_COMM_WORLD);

	printf("\nProcess ID: %d \n", pid);

	printf("Received Matrix: ");
	for (int i = 0; i < 3; i++) {
		printf("%d ", recvMatrix[i]);

	}
	printf("\n");

	printf("Received Vector: ");
	for (int i = 0; i < 3; i++) {
		printf("%d ", vector[i]);

	}
	printf("\n");

	printf("Calculated Value: ");
	int value = 0;
	for (int i = 0; i < 3; i++) {
		value += recvMatrix[i] * vector[i];

	}
	printf("%d \n", value);

	MPI_Gather(&value, 1, MPI_INT, valueArr, 1, MPI_INT, 0, MPI_COMM_WORLD);

	if (pid == 0) {
		printf("Received Calculated Value Array: ");
		for (int i = 0; i < 3; i++) {
			printf("%d ", valueArr[i]);
		}
		printf("\n");
	}

	MPI_Finalize();
	return 0;
}
