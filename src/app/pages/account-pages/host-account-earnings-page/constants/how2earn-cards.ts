import {HowToEarnCardModel} from '../../../../_core/model/how-to-earn-card.model';

export const HOW2EARN_CARDS: HowToEarnCardModel[] = [
    {
        title : 'Joining Bonus',
        description : 'Create an account and get an instant bonus of 100 coins.',
        iconLink : 'assets/reward-card/register.png',
        secondTitle : 'New to the solstream App? Here is your bonus!',
        tokensNumber : '100 solstream'
    },
    {
        title : 'Loyalty and referral bonus',
        description :
            'Users promoting/sharing the solstream TV platform with their friends or acquaintances are also rewarded 100 solstream. ' +
            'Users that register using your referral link will also receive 1 solstream.',
        iconLink : 'assets/reward-card/loyalty.png',
        secondTitle : 'Loyalty and referral rewards (coming soon)',
        tokensNumber : '100 solstream'
    },
    {
        title : 'Every 30 seconds',
        description : 'Watch content and automatically receive 0.01 solstream every 30 seconds. This could be a live stream, but also different kinds of videos. ' +
            'There’s no limit, so you can earn while watching your favorite content. ',
        iconLink : 'assets/reward-card/watch.png',
        secondTitle : 'Watch and Earn',
        tokensNumber : '0.01 solstream'
    },
    {
        title: 'Per interaction up to 0.01 solstream per interaction',
        description: 'Make a comment or leave a like on a video (rewarded only once per video) - ' +
            'Like or chat in a stream (chat rewarded only once every 30 seconds) - ' +
            '\n' +
            'Play sounds and send stickers (coming soon) - ' +
            '\n' +
            'Follow another user or another user following you - ' +
            '\n' +
            'Make a donation to another user - ',
        iconLink: 'assets/reward-card/interact.png',
        secondTitle: 'Interact and Earn',
    },
    {
        title : 'Up to 10 solstream per content uploaded',
        description : 'Users that create content are rewarded for their efforts. \n' +
            '\n' +
            'For every video you upload you’ll receive 0.1 solstream\n' +
            '\n' +
            'For every 30 seconds of streaming you’ll receive 0.01 solstream.',
        iconLink : 'assets/reward-card/filming.png',
        secondTitle : 'Create/Stream and Earn',
    }
];
