import {Component, OnInit} from '@angular/core';
import {TopicApiModel, TopicsService} from './topics.service';
import {forkJoin, Observable} from 'rxjs';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatSelectionListChange} from '@angular/material/list';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-topics',
    templateUrl: './topics.component.html',
    styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

    myGroup;
    sAllValue = '';
    sMainValue = '';
    sUserValue = '';

    searchAllTopics = '';

    topicControl = new FormControl('', [
        Validators.required,
        Validators.minLength(3),
    ]);

    $allTopics: TopicApiModel[] = [];
    $allAllTopics: TopicApiModel[] = [];
    $userProvidedTopics: string[];
    $allUserProvidedTopics: string[];
    $mainSearchTopics: TopicApiModel[];
    $allMainSearchTopics: TopicApiModel[];

    constructor(private topicsService: TopicsService) {
    }

    ngOnInit(): void {
        this.fetchTopics();
        this.topicControl.valueChanges.subscribe(() => {
            const value = this.topicControl.value;
            if (!this.isValid(value)) {
                this.topicControl.setErrors({incorrect: true});
            }

        });
    }

    isValid(value): boolean {
        const names = this.$allTopics.map(x => x.topicName);
        return names.indexOf(value) < 0;
    }

    private fetchTopics(): void {
        forkJoin([
            this.topicsService.getAllTopics(),
            this.topicsService.getAllUserProvidedTopics(),
            this.topicsService.getMainSearchTopics()]
        ).subscribe(([allTopics, allUserTopics, mainTopics]) => {
            this.$allAllTopics = allTopics;
            this.$allMainSearchTopics = mainTopics;
            this.$allUserProvidedTopics = allUserTopics;
            this.filterMain();
        });
    }

    saveTopics(): void {
        const topicValue = this.topicControl.value;
        const t = {topicCode: topicValue, topicName: topicValue, mainSearch: false} as TopicApiModel;
        this.topicsService.addTopic(t).subscribe(() => {
            this.fetchTopics();
            this.topicControl.setValue('');
            this.topicControl.markAsUntouched();
        });
    }

    setAsMain(val: MatSelectionListChange): void {
        const changedOption = val.options[0];
        const topic = changedOption.value as TopicApiModel;
        this.topicsService.setMain(topic.id, changedOption.selected).subscribe(() => {
            this.fetchTopics();
        });
    }


    searchAll(val: string): void {
        this.sAllValue = val;
        this.filterMain();

    }

    searchMain(val: string): void {
        this.sMainValue = val;
        this.filterMain();


    }

    searchUser(val: string): void {
        this.sUserValue = val;
        this.filterMain();

    }

    filterMain(): void {
        this.$mainSearchTopics = this.$allMainSearchTopics.filter(x => x.topicName.indexOf(this.sMainValue) > -1);
        this.$userProvidedTopics = this.$allUserProvidedTopics.filter(x => x.indexOf(this.sUserValue) > -1);
        this.$allTopics = this.$allAllTopics.filter(x => x.topicName.indexOf(this.sAllValue) > -1);
    }

}
