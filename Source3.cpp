#include <mpi.h>
#include <stdio.h>

int main3() {
	int np;
	int pid;
	MPI_Init(NULL, NULL);
	MPI_Comm_size(MPI_COMM_WORLD, &np);
	MPI_Comm_rank(MPI_COMM_WORLD, &pid);
	int arr[6];
	int gsum;

	if (pid == 0) {
		arr[0] = 1;
		arr[1] = 2;
		arr[2] = 3;
		arr[3] = 4;
		arr[4] = 5;
		arr[5] = 6;
	}

	int recvArr[2];
	MPI_Scatter(arr, 2, MPI_INT, recvArr, 2, MPI_INT, 0, MPI_COMM_WORLD);
	int lsum = recvArr[0] + recvArr[1];
	printf("Process ID: %d \t Received Data: %d and %d \t Local Sum: %d \n", pid, recvArr[0], recvArr[1], lsum);

	MPI_Reduce(&lsum, &gsum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
	if (pid == 0) {
		printf("Process ID: %d \t Global Sum: %d \n", pid, gsum);
	}

	MPI_Finalize();
	return 0;
}
