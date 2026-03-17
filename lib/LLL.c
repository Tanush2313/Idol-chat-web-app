#include<stdio.h>
#include<stdlib.h>
#include<time.h>

#define MAX 50

int n;
int a[MAX][MAX];
int visited[MAX];

void dfs(int v)
{
    visited[v]=1;
    printf("%d ",v);

    for(int i=0;i<n;i++)
        if(a[v][i]==1 && visited[i]==0)
            dfs(i);
}

int main()
{
    clock_t starttime,endtime;
    double clk;

    printf("Enter the number of cities (max 50): ");
    scanf("%d",&n);

    if(n>MAX)
    {
        printf("Limit exceeded\n");
        return 0;
    }

    printf("Enter adjacency matrix:\n");
    for(int i=0;i<n;i++)
    for(int j=0;j<n;j++)
        scanf("%d",&a[i][j]);

    for(int i=0;i<n;i++)
        visited[i]=0;

    int source;
    printf("Enter the starting node: ");
    scanf("%d",&source);

    if(source<0 || source>=n)
    {
        printf("Invalid source node\n");
        return 0;
    }

    starttime=clock();
    dfs(source);
    endtime=clock();

    int isConnected=1;
    for(int i=0;i<n;i++)
        if(visited[i]==0)
            isConnected=0;

    if(isConnected)
        printf("\nGraph is Connected\n");
    else
        printf("\nGraph is NOT Connected\n");

    clk=(double)(endtime-starttime)/CLOCKS_PER_SEC;
    printf("Time = %lf seconds\n",clk);

    return 0;
}