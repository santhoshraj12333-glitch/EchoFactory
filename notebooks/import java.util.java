import java.util.Scanner;
public class main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int [] numbers = new int[n];
    for (int i = 0; i<numbers.length; i++) {
      numbers[i] = sc.nextInt();

    }

    
    int left = 0;
    int right = numbers.length - 1;
    while(left<right) {
      int temp = numbers[left];
      numbers [left] = numbers[right];
      numbers[right] = temp;

    left++;
    right--;
   
    }

    for(int i = 0; i<numbers.length; i++) {
      System.out.print(numbers[i] + " ");
    }

  }
}