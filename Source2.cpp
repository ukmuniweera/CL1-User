#include <mpi.h>
#include <stdio.h>

int main2() {
	int np;
	int pid;
	MPI_Init(NULL, NULL);
	MPI_Comm_size(MPI_COMM_WORLD, &np);
	MPI_Comm_rank(MPI_COMM_WORLD, &pid);
	int arr[6];
	int globalMax;

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
	int max;
	if (recvArr[0] > recvArr[1]) {
		max = recvArr[0];
	}
	else {
		max = recvArr[1];
	}
	printf("Process ID: %d \t Received Data: %d and %d \t Local Max: %d \n", pid, recvArr[0], recvArr[1], max);

	MPI_Reduce(&max, &globalMax, 1, MPI_INT, MPI_MAX, 0, MPI_COMM_WORLD);
	if (pid == 0) {
		printf("Process ID: %d \t Global Max: %d \n", pid, globalMax);
	}

	MPI_Finalize();
	return 0;
}
