import { Injectable } from '@angular/core';
import { FEATURES } from '../constants/features';

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {

  private enabledFeatures: Array<string> = [];

  constructor() {
    const url = new URL(window.location.href);
    const featuresInUrl = url.searchParams.get('feature')?.split(',');
    if (featuresInUrl) {
      featuresInUrl.map(feature => FEATURES.includes(feature) ? this.enabledFeatures.push(feature) : console.log(`feature ${feature} is not configured`));
    }
  }

  featureEnabled(featureName: string): boolean {
    return this.enabledFeatures.includes(featureName);
  }

}
