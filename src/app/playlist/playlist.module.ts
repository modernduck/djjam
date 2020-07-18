import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'
import { PlaylistRoutingModule } from './playlist-routing.module';
import { UserService } from "../services/user.service"
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewComponent } from './view/view.component';
import { ChartsModule } from 'ng2-charts';
import { TempoGraphComponent } from './tempo-graph/tempo-graph.component';
import { TempoLineGraphComponent } from './tempo-line-graph/tempo-line-graph.component';
import { TagsPieComponent } from './tags-pie/tags-pie.component';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ArtistsCharacterComponent } from './artists-character/artists-character.component';
import { TracksControllerComponent } from './tracks-controller/tracks-controller.component';


@NgModule({
  declarations: [ViewComponent, TempoGraphComponent, TempoLineGraphComponent, TagsPieComponent, ArtistsCharacterComponent, TracksControllerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ChartsModule,
    PlaylistRoutingModule
  ],
  providers:[UserService]
})
export class PlaylistModule { }
