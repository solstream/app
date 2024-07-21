import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {filter} from 'rxjs/operators';
import {NFTPopupService, NFTPopupState} from './nft-popup.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-nft-modal',
  templateUrl: './nft-popup.component.html',
  styleUrls: ['./nft-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NftPopupComponent implements OnInit {

  @ViewChild('callNFTAPIDialog') callNFTAPIDialog: TemplateRef<any>;
  public NFTPopupState = NFTPopupState;
  public token;
  public currentStep = 'welcome';
  public isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  public video;
  public mintedMessage;
  public nftLink;
  public mintingInProgress = false;
  private modalOpen = false;

  constructor(private dialog: MatDialog,
              private nftPopupService: NFTPopupService,
              private router: Router,
              private httpClient: HttpClient,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) => {
             this.nftPopupService.closeModal();
    });

    this.nftPopupService.modalNFT$.subscribe(mintData => {
      this.video = mintData.video;
      if (mintData.step === NFTPopupState.CLOSE) {
        this.dialog.closeAll();
        this.modalOpen = false;
      } else if (this.modalOpen) {
        this.goToStep(mintData.step);
      } else if (mintData.step === NFTPopupState.OPEN && mintData.video) {
        this.openDialog(mintData.step);
        this.modalOpen = true;
      }
    });
  }

  closeDialog(): void {
    this.nftPopupService.closeModal();
  }

  goToStep(step): void {
    this.currentStep = step;
  }

  openDialog(step): void {
    const dialogRef = this.dialog.open(this.callNFTAPIDialog, {
      panelClass: 'login-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('800px', '650px');
      }
    });

    this.currentStep = step;

    dialogRef.afterClosed().subscribe(() => {
      smallDialogSubscription.unsubscribe();
      this.modalOpen = false;
    });
  }

  mintNFT(): void {
    if (!this.mintingInProgress) {
      this.mintingInProgress = true;
      const request = {
        tokenUri: this.video.ipfsGatewayUrl || 'dsadasda'
      };
      this.httpClient.post('https://gb-wallet-api.azurewebsites.net/nft', request, {

      }).subscribe((response) => {
        this.mintingInProgress = false;

        this.mintedMessage = 'Congratulations, your NFT has been minted.';
        this.nftLink = 'https://mumbai.polygonscan.com/tx/' + response;
        console.log(response);
      }, (error) => {
        this.mintingInProgress = false;
        console.log('there is an API error', error);
      });
    }
  }
}
