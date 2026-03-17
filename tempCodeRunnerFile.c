#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define TRUE 1
#define FALSE 0

/* Function to create heap using bottom-up approach */
void heapbottomup(int h[], int n)
{
    int i, k, v, j, heap;

    for (i = n / 2; i >= 1; i--)
    {
        k = i;
        v = h[k];
        heap = FALSE;

        while (!heap && (2 * k) <= n)
        {
            j = 2 * k;

            if (j < n)
            {
                if (h[j] < h[j + 1])
                    j = j + 1;
            }

            if (v >= h[j])
                heap = TRUE;
            else
            {
                h[k] = h[j];
                k = j;
            }
        }
        h[k] = v;
    }
}

/* Heap Sort Function */
void heapsort(int h[], int n)
{
    int temp, last;

    if (n <= 1)
        return;

    heapbottomup(h, n);

    last = n;

    while (last > 1)
    {
        temp = h[1];
        h[1] = h[last];
        h[last] = temp;

        last--;
        heapbottomup(h, last);
    }
}

/* Main Function */
int main()
{
    int h[20], n, i;
    double clk;
    clock_t starttime, endtime;

    printf("Enter the number of resumes: ");
    scanf("%d", &n);

    /* Generate random ranks */
    printf("\nThe candidates ranks are:\n");
    for (i = 1; i <= n; i++)
    {
        h[i] = rand() % 100;
        printf("%d\t", h[i]);
    }

    /* Start timer */
    starttime = clock();

    heapsort(h, n);

    /* End timer */
    endtime = clock();

    clk = (double)(endtime - starttime) / CLOCKS_PER_SEC;

    printf("\n\nThe ranks in sorted order:\n");
    for (i = 1; i <= n; i++)
        printf("%d\t", h[i]);

    printf("\n\nThe run time is %f seconds\n", clk);

    return 0;
}
