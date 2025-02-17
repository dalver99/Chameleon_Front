import { NextResponse } from 'next/server';


const bestReviews = [
  {
    id: 4,
    content: 'ChamelNeon 덕분에 오프라인 광고를 더 많이 이용하게 되었어요!',
    author_id: 8,
    ad_id: 92,
    rating: 5,
    created_at: '2025-01-30T20:27:10.000Z',
    updated_at: '2025-01-30T20:27:10.000Z',
    status: 'active',
    name: '김준영',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 2,
    engagement_score: 4
  },
  {
    id: 9,
    content: '이 서비스를 사용하면서 가장 좋았던 점은 다양한 통계와 데이터를 제공해 준다는 거예요. 광고 성과를 구체적인 수치로 확인할 수 있어 전략을 조정하는 데 매우 유용했습니다. 실시간 통계를 통해 어떤 부분이 잘 되고 있는지, 또 어떤 부분을 개선해야 하는지 명확하게 파악할 수 있었죠.\n' +
      '\n' +
      '또한, 피드백이 정말 빠르고 친절했습니다. 질문을 드리면 언제나 신속하게 답변을 주셔서 광고 진행 중에 걱정이 없었고, 필요한 사항을 꼼꼼히 체크해 주셔서 더욱 신뢰할 수 있었습니다. 다양한 데이터와 빠른 피드백 덕분에 광고 운영이 훨씬 더 원활하고 효율적으로 진행될 수 있었어요!',
    author_id: 8,
    ad_id: 93,
    rating: 5,
    created_at: '2025-02-03T20:36:26.000Z',
    updated_at: '2025-02-09T17:30:14.000Z',
    status: 'active',
    name: '김준영',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0,
    engagement_score: 2
  },
  {
    id: 7,
    content: '광고 예산을 어떻게 써야 할지 늘 고민이었는데, 이 대행사를 이용하고 나서 그런 걱정이 확 줄었습니다. 주어진 예산 내에서 최대한의 효율을 뽑아내는 방식으로 광고를 집행해 주다 보니, 불필요한 지출 없이도 높은 성과를 낼 수 있었어요. AI를 활용한 최적화 덕분인지 클릭률과 전환율도 눈에 띄게 좋아졌습니다.\n' +
      '\n' +
      '또 한 가지 마음에 들었던 점은 계약을 연장하는 게 부담스럽지 않다는 거예요. 처음에는 짧게 테스트해 보려고 했는데, 성과가 기대 이상으로 나오다 보니 자연스럽게 연장을 결정하게 됐어요. 예산 대비 효과적인 광고를 찾고 있다면 정말 추천할 만한 서비스입니다!',
    author_id: 31,
    ad_id: 92,
    rating: 5,
    created_at: '2025-02-03T20:23:55.000Z',
    updated_at: '2025-02-03T20:23:55.000Z',
    status: 'active',
    name: '김우현',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0,
    engagement_score: 2
  },
  {
    id: 6,
    content: '이 대행사의 대시보드는 정말 직관적이고 유용합니다. 광고 성과를 한눈에 볼 수 있도록 간단한 통계를 제공해 주는데, 복잡한 데이터 없이도 핵심 지표를 쉽게 파악할 수 있어서 너무 편리해요.\n' +
      '\n' +
      '특히 마음에 들었던 건 실시간 이미지 슬라이드 기능입니다. 광고가 실제로 노출되는 현장을 이미지로 확인할 수 있어서 어떤 환경에서 광고가 집행되는지 바로 알 수 있더라고요. 덕분에 필요할 때마다 전략을 빠르게 조정할 수 있었고, 성과 분석도 훨씬 쉬워졌어요.\n' +
      '\n' +
      '깔끔한 UI와 직관적인 디자인 덕분에 사용하기도 편하고, 실시간 데이터를 활용한 인사이트 제공이 뛰어난 대시보드였습니다. 광고 운영하는 분들이라면 꼭 한 번 써볼 만한 서비스예요!',
    author_id: 33,
    ad_id: 95,
    rating: 5,
    created_at: '2025-02-03T20:21:48.000Z',
    updated_at: '2025-02-03T20:21:48.000Z',
    status: 'active',
    name: '이예주',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0,
    engagement_score: 2
  },
  {
    id: 5,
    content: '다른 광고 대행사도 여러 곳 경험해봤지만, 여기처럼 AI 기반으로 정교하게 타겟팅해주는 곳은 처음이었습니다. 단순히 광고를 집행하는 게 아니라, 실시간으로 광고를 보는 사람들의 통계를 분석하고 그에 맞춰 최적화해 주는 게 정말 인상적이었어요. 덕분에 광고 효율도 눈에 띄게 좋아졌고, 불필요한 예산 낭비도 줄일 수 있었습니다.\n' +
      '\n' +
      '특히, AI가 제공하는 인사이트 덕분에 광고 전략을 수정하는 과정도 훨씬 수월했습니다. 기존에는 대략적인 추측으로 진행했던 부분들이 이제는 데이터 기반으로 명확하게 판단할 수 있게 됐어요. 담당자분들도 피드백을 빠르게 반영해 주셔서 전반적인 경험이 굉장히 만족스러웠습니다. 앞으로도 계속 함께하고 싶은 대행사입니다!',
    author_id: 22,
    ad_id: 91,
    rating: 5,
    created_at: '2025-02-03T20:19:17.000Z',
    updated_at: '2025-02-03T20:19:17.000Z',
    status: 'active',
    name: '성연서',
    company: '에이블스쿨6기',
    likes_count: 2,
    comments_count: 0,
    engagement_score: 2
  }
];

const reviews = [
  {
    id: 9,
    content: '이 서비스를 사용하면서 가장 좋았던 점은 다양한 통계와 데이터를 제공해 준다는 거예요. 광고 성과를 구체적인 수치로 확인할 수 있어 전략을 조정하는 데 매우 유용했습니다. 실시간 통계를 통해 어떤 부분이 잘 되고 있는지, 또 어떤 부분을 개선해야 하는지 명확하게 파악할 수 있었죠.\n' + '\n' + '또한, 피드백이 정말 빠르고 친절했습니다. 질문을 드리면 언제나 신속하게 답변을 주셔서 광고 진행 중에 걱정이 없었고, 필요한 사항을 꼼꼼히 체크해 주셔서 더욱 신뢰할 수 있었습니다. 다양한 데이터와 빠른 피드백 덕분에 광고 운영이 훨씬 더 원활하고 효율적으로 진행될 수 있었어요!',
    author_id: 8,
    ad_id: 93,
    rating: 5,
    created_at: '2025-02-03T20:36:26.000Z',
    updated_at: '2025-02-09T17:30:14.000Z',
    status: 'active',
    name: '김준영',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0
  },
  {
    id: 7,
    content: '광고 예산을 어떻게 써야 할지 늘 고민이었는데, 이 대행사를 이용하고 나서 그런 걱정이 확 줄었습니다. 주어진 예산 내에서 최대한의 효율을 뽑아내는 방식으로 광고를 집행해 주다 보니, 불필요한 지출 없이도 높은 성과를 낼 수 있었어요. AI를 활용한 최적화 덕분인지 클릭률과 전환율도 눈에 띄게 좋아졌습니다.\n' + '\n' + '또 한 가지 마음에 들었던 점은 계약을 연장하는 게 부담스럽지 않다는 거예요. 처음에는 짧게 테스트해 보려고 했는데, 성과가 기대 이상으로 나오다 보니 자연스럽게 연장을 결정하게 됐어요. 예산 대비 효과적인 광고를 찾고 있다면 정말 추천할 만한 서비스입니다!',
    author_id: 31,
    ad_id: 92,
    rating: 5,
    created_at: '2025-02-03T20:23:55.000Z',
    updated_at: '2025-02-03T20:23:55.000Z',
    status: 'active',
    name: '김우현',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0
  },
  {
    id: 8,
    content: '저처럼 영세한 기업에서도 큰 예산이나 많은 인적 자원을 투자하지 않고도 이 서비스를 간편하게 이용할 수 있다는 점이 정말 좋았습니다. 복잡한 설정이나 추가 비용 없이, 필요한 만큼만 예산을 투입하면 효율적으로 광고를 집행할 수 있어요. 대행사에서 제공하는 데이터 기반의 최적화 덕분에, 적은 자원으로도 높은 효과를 볼 수 있었습니다.\\n\\n서비스 자체가 직관적이고 사용하기 쉬워서, 전담 인력을 두지 않은 작은 기업에서도 부담 없이 활용할 수 있어요. 앞으로도 지속적으로 이용하고 싶은 서비스입니다!',
    author_id: 27,
    ad_id: 5,
    rating: 4,
    created_at: '2025-02-03T20:23:55.000Z',
    updated_at: '2025-02-09T17:27:54.000Z',
    status: 'active',
    name: '김선우',
    company: '이정하컴퍼니',
    likes_count: 0,
    comments_count: 0
  },
  {
    id: 6,
    content: '이 대행사의 대시보드는 정말 직관적이고 유용합니다. 광고 성과를 한눈에 볼 수 있도록 간단한 통계를 제공해 주는데, 복잡한 데이터 없이도 핵심 지표를 쉽게 파악할 수 있어서 너무 편리해요.\n' +
      '\n' +
      '특히 마음에 들었던 건 실시간 이미지 슬라이드 기능입니다. 광고가 실제로 노출되는 현장을 이미지로 확인할 수 있어서 어떤 환경에서 광고가 집행되는지 바로 알 수 있더라고요. 덕분에 필요할 때마다 전략을 빠르게 조정할 수 있었고, 성과 분석도 훨씬 쉬워졌어요.\n' + '\n' + '깔끔한 UI와 직관적인 디자인 덕분에 사용하기도 편하고, 실시간 데이터를 활용한 인사이트 제공이 뛰어난 대시보드였습니다. 광고 운영하는 분들이라면 꼭 한 번 써볼 만한 서비스예요!',
    author_id: 33,
    ad_id: 95,
    rating: 5,
    created_at: '2025-02-03T20:21:48.000Z',
    updated_at: '2025-02-03T20:21:48.000Z',
    status: 'active',
    name: '이예주',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 0
  },
  {
    id: 5,
    content: '다른 광고 대행사도 여러 곳 경험해봤지만, 여기처럼 AI 기반으로 정교하게 타겟팅해주는 곳은 처음이었습니다. 단순히 광고를 집행하는 게 아니라, 실시간으로 광고를 보는 사람들의 통계를 분석하고 그에 맞춰 최적화해 주는 게 정말 인상적이었어요. 덕분에 광고 효율도 눈에 띄게 좋아졌고, 불필요한 예산 낭비도 줄일 수 있었습니다.\n' +
      '\n' + '특히, AI가 제공하는 인사이트 덕분에 광고 전략을 수정하는 과정도 훨씬 수월했습니다. 기존에는 대략적인 추측으로 진행했던 부분들이 이제는 데이터 기반으로 명확하게 판단할 수 있게 됐어요. 담당자분들도 피드백을 빠르게 반영해 주셔서 전반적인 경험이 굉장히 만족스러웠습니다. 앞으로도 계속 함께하고 싶은 대행사입니다!',
    author_id: 22,
    ad_id: 91,
    rating: 5,
    created_at: '2025-02-03T20:19:17.000Z',
    updated_at: '2025-02-03T20:19:17.000Z',
    status: 'active',
    name: '성연서',
    company: '에이블스쿨6기',
    likes_count: 2,
    comments_count: 0
  },
  {
    id: 4,
    content: 'ChamelNeon 덕분에 오프라인 광고를 더 많이 이용하게 되었어요!',
    author_id: 8,
    ad_id: 92,
    rating: 5,
    created_at: '2025-01-30T20:27:10.000Z',
    updated_at: '2025-01-30T20:27:10.000Z',
    status: 'active',
    name: '김준영',
    company: '이정하컴퍼니',
    likes_count: 2,
    comments_count: 2
  },
  {
    id: 3,
    content: '다음에 또 이용하고 싶어요.',
    author_id: 14,
    ad_id: 91,
    rating: 4,
    created_at: '2025-01-30T16:33:07.000Z',
    updated_at: '2025-01-30T16:33:07.000Z',
    status: 'active',
    name: '김기태',
    company: '이정하컴퍼니',
    likes_count: 1,
    comments_count: 0
  },
  {
    id: 2,
    content: '광고에 사용하는 비용이 확연히 감소했어요.',
    author_id: 14,
    ad_id: 92,
    rating: 5,
    created_at: '2025-01-30T16:32:27.000Z',
    updated_at: '2025-01-30T16:32:27.000Z',
    status: 'active',
    name: '김기태',
    company: '이정하컴퍼니',
    likes_count: 0,
    comments_count: 0
  },
  {
    id: 1,
    content: '정말 좋아요!',
    author_id: 14,
    ad_id: 90,
    rating: 5,
    created_at: '2025-01-28T01:10:38.000Z',
    updated_at: '2025-02-03T22:03:44.000Z',
    status: 'active',
    name: '김기태',
    company: '이정하컴퍼니',
    likes_count: 0,
    comments_count: 0
  }
];


export async function GET(req) {
  try {

    const ratingAvg = 4.7778;
    const cnts = 9;
    const eachs = { '1': 0, '2': 0, '3': 0, '4': 2, '5': 7 };
    return NextResponse.json({ ratingAvg, eachs, cnts, bestReviews }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /reviews:", error);
    return NextResponse.json({ error: "Failed to fetch rating data" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { sorting = "latest", page = 1, limit = 10 } = await req.json();

    let filteredReviews = reviews.filter(review => review.status === "active");

    switch (sorting) {
      case "latest":
        filteredReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "highRating":
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowRating":
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "mostLikes":
        filteredReviews.sort((a, b) => b.likes_count - a.likes_count || new Date(b.created_at) - new Date(a.created_at));
        break;
      case "mostComments":
        filteredReviews.sort((a, b) => b.comments_count - a.comments_count || new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        throw new Error("Invalid sorting option");
    }

    const totalReviews = filteredReviews.length;
    const totalPages = Math.ceil(totalReviews / limit);
    const offset = (page - 1) * limit;
    const paginatedReviews = filteredReviews.slice(offset, offset + limit);

    return NextResponse.json(
      {
        reviews: paginatedReviews,
        meta: { totalReviews, totalPages },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in POST /reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}