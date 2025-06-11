#include <mpi.h>
#include <stdio.h>

int main0() {
	int np;
	int pid;
	MPI_Init(NULL, NULL);
	MPI_Comm_size(MPI_COMM_WORLD, &np);
	MPI_Comm_rank(MPI_COMM_WORLD, &pid);
	int arr[6], mul, recvArr[6];

	if (pid == 0) {
		mul = 2;
		arr[0] = 1;
		arr[1] = 2;
		arr[2] = 3;
		arr[3] = 4;
		arr[4] = 5;
		arr[5] = 6;
	}

	int recvEle;
	MPI_Bcast(&mul, 1, MPI_INT, 0, MPI_COMM_WORLD);
	MPI_Scatter(arr, 1, MPI_INT, &recvEle, 1, MPI_INT, 0, MPI_COMM_WORLD);
	printf("\nProcess ID: %d \n", pid);
	printf("Received Data: %d  and %d \n", mul, recvEle);
	int value = mul * recvEle;
	printf("Send Data: %d \n", value);
	MPI_Allgather(&value, 1, MPI_INT, recvArr, 1, MPI_INT, MPI_COMM_WORLD);

	printf("Received Full Array: ");
	for (int i = 0; i < 6; i++) {
		printf("%d ", recvArr[i]);
	}
	printf("\n");
	
	MPI_Finalize();
	return 0;
}
