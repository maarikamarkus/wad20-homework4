import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment'

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

// Test that exactly as many posts are rendered as contained in testData variable
describe('Same number of posts (as in testData)', () => {
    let postsInTestData = testData.length;
    
    const wrapper = mount(Posts, {router, store, localVue});

    it('count(real posts) == count(posts in testData)', function () {
        // veider alternatiiv -> wrapper.vm.$data["posts"].length;
        let actualPostCount = wrapper.findAll(".post").length 
        expect(actualPostCount).toBe(postsInTestData)
    });
});

// Test that if post has media property, image or video tags are rendered 
// depending on media.type property, or if media property is absent nothing is rendered.
describe('Media property rendered if applicable', () => {
    const wrapper = mount(Posts, {router, store, localVue});
    
    for (const post of testData) {
        if (post.media === null) {
            it('should not render media', function () {
                let media = wrapper.find('.post-image');
                expect(media.exists()).toBe(false);
            });
        } else {
            if (post.media.type === 'image') {
                it('should render image', function () {
                    let image = wrapper.find('.post-image img');
                    expect(image.exists()).toBe(true);
                });
            } else if (post.media.type === 'video') {
                it('should render video', function () {
                    let video = wrapper.find('.post-image video');
                    expect(video.exists()).toBe(true);
                });
            }
        }
    }
});

describe('Test that post create time is displayed in correct format(Saturday, December 5, 2020 1:53 PM', () => {
    const wrapper = mount(Posts, {router, store, localVue});

    for (const post of testData) {
        const date = moment(post.createTime).format('LLLL');

        it('should display date in correct format', function () {
            let createTime = wrapper.find('.post-author > small');
            expect(createTime.html()).toContain(date);
        });
    }
});

