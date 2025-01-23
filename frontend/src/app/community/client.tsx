"use client"

import { useEffect, useState, useRef } from "react"
import { Search, MessageSquare, Heart, Clock, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import Image from "next/image"
import Link from "next/link"

interface Post {
  id: number
  title: string
  description: string
  comments: number
  likes: number
  timeAgo: string
  author: string
  thumbnail: string
}

export function CommunityClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(2) // 초기 데이터가 1페이지이므로 2부터 시작
  const loader = useRef(null)

  // 실시간 검색 기능
  useEffect(() => {
    const searchPosts = async () => {
      if (searchQuery.trim()) {
        try {
          setLoading(true)
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          const results = await response.json()
          setFilteredPosts(results)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setFilteredPosts(posts)
      }
    }

    // 디바운싱 처리
    const debounceTimer = setTimeout(() => {
      searchPosts()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, posts])

  // 스크롤 탑 버튼 표시 여부 체크
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 무한 스크롤 로직
  const loadMore = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?page=${page}`)
      const newPosts = await response.json()

      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts])
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Failed to load more posts:", error)
    } finally {
      setLoading(false)
    }
  }

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && !loading) {
          loadMore()
        }
      },
      { threshold: 1.0 },
    )

    const currentLoader = loader.current
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader)
      }
    }
  }, [loading])

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-6">
            {["Popular", "General", "Reviews", "Announcement"].map((tab) => (
              <button key={tab} className="text-sm font-medium hover:text-primary">
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="p-4 space-y-4">
        {(filteredPosts.length > 0 ? filteredPosts : posts).map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="p-4">
                <div className="flex gap-4 justify-between">
                  {/* 텍스트 콘텐츠를 왼쪽으로 */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.timeAgo}</span>
                      </div>
                      <span>by {post.author}</span>
                    </div>
                  </div>
                  {/* 이미지를 오른쪽으로 */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={post.thumbnail || "/example.jpg"} alt={post.title} fill className="object-cover" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {/* 로더 */}
        <div ref={loader} className="h-10 flex items-center justify-center">
          {loading && <div className="text-muted-foreground">Loading...</div>}
        </div>
      </div>

      {/* Write 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
        <Link href="/community/write">
          <Button className="bg-fuchsia-500 hover:bg-fuchsia-600">WRITE</Button>
        </Link>
      </div>

      {/* Scroll to top 버튼 */}
      {showScrollTop && (
        <Button
          className="fixed bottom-20 right-4 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full p-2"
          size="icon"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </main>
  )
}



// 'use client';

// import { useEffect, useState, useRef } from "react";
// import { Search, X, MessageSquare, Heart, Clock, ArrowUp } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";
// import Image from "next/image";
// import Link from "next/link";

// interface Post {
//   id: number;
//   title: string;
//   description: string;
//   comments: number;
//   likes: number;
//   timeAgo: string;
//   author: string;
//   thumbnail: string;
// }

// export function CommunityClient({ initialPosts }: { initialPosts: Post[] }) {
//   const [posts, setPosts] = useState<Post[]>(initialPosts);
//   const [loading, setLoading] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
//   const [page, setPage] = useState(2); // 초기 데이터가 1페이지이므로 2부터 시작
//   const loader = useRef(null);

// // 검색 기능
// useEffect(() => {
//   const searchPosts = async () => {
//     if (searchQuery.trim()) {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
//         const results = await response.json();
//         setFilteredPosts(results);
//       } catch (error) {
//         console.error("Search failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setFilteredPosts(posts);
//     }
//   };

//   // 디바운싱 처리
//   const debounceTimer = setTimeout(() => {
//     searchPosts();
//   }, 300);

//   return () => clearTimeout(debounceTimer);
// }, [searchQuery, posts]);

//   // 스크롤 탑 버튼 표시 여부 체크
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 200);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 무한 스크롤 로직
//   const loadMore = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/posts?page=${page}`);
//       const newPosts = await response.json();
      
//       if (newPosts.length > 0) {
//         setPosts(prev => [...prev, ...newPosts]);
//         setPage(prev => prev + 1);
//       }
//     } catch (error) {
//       console.error("Failed to load more posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Intersection Observer 설정
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (first.isIntersecting && !loading) {
//           loadMore();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     const currentLoader = loader.current;
//     if (currentLoader) {
//       observer.observe(currentLoader);
//     }

//     return () => {
//       if (currentLoader) {
//         observer.unobserve(currentLoader);
//       }
//     };
//   }, [loading]);

//   // 최상단으로 스크롤
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // 검색 초기화
//   const clearSearch = () => {
//     setSearchQuery("");
//     setSearchOpen(false);
//   };

//   return (
//     <main className="min-h-screen bg-background pb-16">
//       {/* 헤더 */}
//       <div className="sticky top-0 z-10 bg-background border-b">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex gap-6">
//             {["Popular", "General", "Reviews", "Announcement"].map((tab) => (
//               <button key={tab} className="text-sm font-medium hover:text-primary">
//                 {tab}
//               </button>
//             ))}
//           </div>
//           <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
//             <Search className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       {/* 검색창 */}
//       {searchOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-4 w-full max-w-lg">
//             <div className="flex items-center gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="Search posts..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="flex-1 border border-gray-300 rounded-md px-4 py-2"
//               />
//               {searchQuery && (
//                 <Button variant="ghost" size="icon" onClick={clearSearch}>
//                   <X className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>
//             {searchQuery && (
//               <p className="text-sm text-muted-foreground mb-2">Found {filteredPosts.length} results</p>
//             )}
//             <Button variant="ghost" onClick={() => setSearchOpen(false)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}

//         {/* 게시글 목록 */}
//         <div className="p-4 space-y-4">
//         {(filteredPosts.length > 0 ? filteredPosts : posts).map((post) => (
//             <Link key={post.id} href={`/community/${post.id}`}>
//             <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
//                 <div className="p-4">
//                 <div className="flex gap-4 justify-between"> {/* justify-between 추가 */}
//                     {/* 텍스트 콘텐츠를 왼쪽으로 */}
//                     <div className="flex-1 min-w-0">
//                     <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
//                     <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-1">
//                         <MessageSquare className="w-4 h-4" />
//                         <span>{post.comments}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                         <Heart className="w-4 h-4" />
//                         <span>{post.likes}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>{post.timeAgo}</span>
//                         </div>
//                         <span>by {post.author}</span>
//                     </div>
//                     </div>
//                     {/* 이미지를 오른쪽으로 */}
//                     <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
//                     <Image src={post.thumbnail || "/example.jpg"} alt={post.title} fill className="object-cover" />
//                     </div>
//                 </div>
//                 </div>
//             </Card>
//             </Link>
//         ))}
//         {/* 로더 */}
//         <div ref={loader} className="h-10 flex items-center justify-center">
//             {loading && <div className="text-muted-foreground">Loading...</div>}
//         </div>
//         </div>

//       {/* Write 버튼 */}
//       <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
//         <Link href="/community/write">
//           <Button className="bg-fuchsia-500 hover:bg-fuchsia-600">WRITE</Button>
//         </Link>
//       </div>

//       {/* Scroll to top 버튼 */}
//       {showScrollTop && (
//         <Button
//           className="fixed bottom-20 right-4 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full p-2"
//           size="icon"
//           onClick={scrollToTop}
//         >
//           <ArrowUp className="w-5 h-5" />
//         </Button>
//       )}
//     </main>
//   );
// }
