import { Job } from './../../models/job.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";

@Component({
  selector: 'app-user-jobs',
  templateUrl: './user-jobs.component.html',
  styleUrls: ['./user-jobs.component.scss']
})
export class UserJobsComponent implements OnInit {

  constructor(
    public _LayoutService: LayoutService,
    public router: Router,
    ) {}

  jobs: Job[];
  user;
  actualPage;
  previousPage;
  nextPage;
  totalPages: Number[] = [];
  limit = 5;

  disablePreviousButton: boolean = false;
  disableNextButton: boolean = false;

  ngOnInit() {
    this._LayoutService.GetUserInstance()
    .subscribe((data:any) => {
      this.user = data.data;

      this._LayoutService.GetJobsByUserId(1,this.limit)
      .subscribe((data:any) => {
        this.jobs = data.jobs.results;
        this.actualPage = data.jobs.actualPage;

        for (let index = 1; index <= data.jobs.totalPages; index++) {
          this.totalPages.push(index);
        }

        if(!!data.jobs.previousPage){
          this.previousPage = data.jobs.previousPage.page;
          this.disablePreviousButton = false;
        } else {
          this.disablePreviousButton = true;
        };
        
        if(!!data.jobs.nextPage){
          this.nextPage = data.jobs.nextPage.page
          this.disableNextButton = false;
        } else {
          this.disableNextButton = true;
        };
      })
      
    }, (error: any) => {
      if(error.status === 401){
        swal.fire({
          html: `<span style='color:grey'> ${error.error.msg} <span>`,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-danger btn-simple",
          background: '#ffffff'
        });
        this.router.navigate([`/login`]);
      }
    });

  }


  next(){ //Pagina Siguiente
    
    this._LayoutService.GetJobsByUserId(this.nextPage,this.limit)
    .subscribe((data:any) => {
      this.jobs = [];
      this.jobs = data.jobs.results;
      this.actualPage = data.jobs.actualPage;

      if(!!data.jobs.previousPage){
        this.previousPage = data.jobs.previousPage.page;
        this.disablePreviousButton = false;
      } else {
        this.disablePreviousButton = true;
      };
      
      if(!!data.jobs.nextPage){
        this.nextPage = data.jobs.nextPage.page;
        this.disableNextButton = false;
      } else {
        this.disableNextButton = true;
      };
    });
  }

  previous(){ //Pagina Previa
    
    this._LayoutService.GetJobsByUserId(this.previousPage,this.limit)
    .subscribe((data:any) => {
    
      this.jobs = [];
      this.jobs = data.jobs.results;
      this.actualPage = data.jobs.actualPage;

      if(!!data.jobs.previousPage){
        this.previousPage = data.jobs.previousPage.page;
        this.disablePreviousButton = false;
      } else {
        this.disablePreviousButton = true;
      };
      
      if(!!data.jobs.nextPage){
        this.nextPage = data.jobs.nextPage.page;
        this.disableNextButton = false;
      } else {
        this.disableNextButton = true;
      };
    });
  }

  actual(i){ //Pagina Actual
    this._LayoutService.GetJobsByUserId(i,this.limit)
    .subscribe((data:any) => {
    
      this.jobs = [];
      this.jobs = data.jobs.results;
      this.actualPage = data.jobs.actualPage;

      if(!!data.jobs.previousPage){
        this.previousPage = data.jobs.previousPage.page;
        this.disablePreviousButton = false;
      } else {
        this.disablePreviousButton = true;
      };
      
      if(!!data.jobs.nextPage){
        this.nextPage = data.jobs.nextPage.page;
        this.disableNextButton = false;
      } else {
        this.disableNextButton = true;
      };
    });
  }

  editJob(job){
    this.router.navigate([`/jobs/job/${job.Url}/edit`]);
  }

  deleteJob(job){

    swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger btn-simple",
      confirmButtonClass: "btn btn-success btn-simple",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      buttonsStyling: false,
      background: '#ffffff'
    })
    .then(result => {
      if (result.value) {
        this._LayoutService.DeleteJob(job._id)
        .subscribe((data:any) => {
          
          this._LayoutService.GetJobsByUserId(1,this.limit)
          .subscribe((data:any) => {
            this.jobs = data.jobs.results;
            this.actualPage = data.jobs.actualPage;
    
            if(!!data.jobs.previousPage){
              this.previousPage = data.jobs.previousPage.page;
              this.disablePreviousButton = false;
            } else {
              this.disablePreviousButton = true;
            };
            
            if(!!data.jobs.nextPage){
              this.nextPage = data.jobs.nextPage.page
              this.disableNextButton = false;
            } else {
              this.disableNextButton = true;
            };
          })
          swal.fire({
            title: "Deleted.",
            html: `<span style='color:grey'> ${job.Title} position deleted permanently... <span>`,
            confirmButtonClass: "btn btn-danger btn-simple",
            background: '#ffffff'
          });

        }, error => {
          console.error(error);
        });

      }
    });

  }

  openJob(job: Job){
    const jobUrl = `/jobs/job/${job.Url}`;
    this.router.navigate([jobUrl]);
  }

  viewCandidates(job:Job){
    this.router.navigate([`/jobs/job/${job.Url}/candidates`]);
  }
}
