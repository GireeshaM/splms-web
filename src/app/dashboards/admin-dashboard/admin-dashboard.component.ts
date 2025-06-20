import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from '../../navbars/navbar/navbar.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements AfterViewInit {
 ngAfterViewInit() {
  setTimeout(() => this.renderCharts(), 100); // 100ms delay to ensure DOM ready
}

  private renderCharts(): void {
    this.createChart(
      'deviceChart',
      'doughnut',
      ['Python', '.NET', 'Java', 'SQL', 'AI/ML'],
      [
        {
          data: [30, 30, 10, 10, 20],
          backgroundColor: [
            '#4F46E5',
            '#F59E0B',
            '#EF4444',
            '#a5d6a7',
            '#ef9a9a',
          ],
        },
      ]
    );

    this.createChart(
      'enrollmentChart',
      'bar',
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      [
        {
          label: 'Enrollments',
          data: [3200, 4500, 5000, 6000, 7000, 5200],
          backgroundColor: '#42a5f5',
        },
      ]
    );

    this.createChart(
      'courseRevenueChart',
      'pie',
      ['Advanced Python', 'Web Dev', 'Data Science', 'Machine Learning'],
      [
        {
          data: [12500, 9800, 7500, 6400],
          backgroundColor: ['#ffcc80', '#90caf9', '#a5d6a7', '#ef9a9a'],
        },
      ]
    );
  }

private createChart(
  elementId: string,
  type: any,
  labels: string[],
  datasets: any[]
): void {
  const ctx = document.getElementById(elementId) as HTMLCanvasElement;

  if (!ctx) {
    console.error(`Chart canvas with ID '${elementId}' not found.`);
    return;
  } else {
    console.log(`Found canvas: ${elementId}`, ctx);
  }

  new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: { enabled: true },
      },
    },
  });
}

}
