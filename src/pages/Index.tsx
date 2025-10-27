import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const mockVideos = [
  {
    id: 1,
    username: 'yulia_star',
    description: 'Мой первый танец! 💃',
    likes: 1240,
    comments: 89,
    shares: 45,
    videoUrl: '#',
    liked: false,
    favorited: false,
  },
  {
    id: 2,
    username: 'creative_yu',
    description: 'Новый рецепт! Попробуйте 👨‍🍳',
    likes: 3450,
    comments: 234,
    shares: 120,
    videoUrl: '#',
    liked: false,
    favorited: false,
  },
  {
    id: 3,
    username: 'travel_yu',
    description: 'Красота природы 🏔️',
    likes: 5670,
    comments: 456,
    shares: 234,
    videoUrl: '#',
    liked: false,
    favorited: false,
  },
];

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'feed' | 'search' | 'favorites' | 'profile'>('feed');
  const [videos, setVideos] = useState(mockVideos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDescription, setVideoDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentVideo = videos[currentVideoIndex];

  const handleLike = (id: number) => {
    setVideos(videos.map(v => 
      v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v
    ));
  };

  const handleFavorite = (id: number) => {
    setVideos(videos.map(v => 
      v.id === id ? { ...v, favorited: !v.favorited } : v
    ));
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (direction === 'up' && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите видео файл',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 100MB',
        variant: 'destructive',
      });
      return;
    }

    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);
  };

  const handleUpload = () => {
    if (!videoFile) {
      toast({
        title: 'Ошибка',
        description: 'Выберите видео для загрузки',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newVideo = {
            id: videos.length + 1,
            username: 'my_username',
            description: videoDescription || 'Новое видео',
            likes: 0,
            comments: 0,
            shares: 0,
            videoUrl: videoPreview || '#',
            liked: false,
            favorited: false,
          };
          setVideos([newVideo, ...videos]);
          setIsUploading(false);
          setShowUploadDialog(false);
          setVideoPreview(null);
          setVideoFile(null);
          setVideoDescription('');
          setUploadProgress(0);
          setCurrentTab('profile');
          toast({
            title: 'Успешно!',
            description: 'Видео опубликовано',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetUploadDialog = () => {
    setShowUploadDialog(false);
    setVideoPreview(null);
    setVideoFile(null);
    setVideoDescription('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const GoldAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-10 h-10 text-xl',
      md: 'w-12 h-12 text-2xl',
      lg: 'w-20 h-20 text-4xl',
    };

    return (
      <div className={`${sizeClasses[size]} rounded-full gold-border flex items-center justify-center bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 font-bold shadow-lg`}>
        <span className="gold-text drop-shadow-lg" style={{ WebkitTextFillColor: '#1A1F2C', backgroundClip: 'unset', WebkitBackgroundClip: 'unset' }}>Ю</span>
      </div>
    );
  };

  const renderFeed = () => (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      
      <div 
        className="h-full w-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 flex items-center justify-center relative"
        onWheel={(e) => handleScroll(e.deltaY > 0 ? 'down' : 'up')}
      >
        <div className="text-muted-foreground text-6xl">📹</div>
        
        <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
          <GoldAvatar size="md" />
          <div>
            <p className="font-bold text-white drop-shadow-lg">{currentVideo.username}</p>
            <p className="text-sm text-white/80">{currentVideo.description}</p>
          </div>
        </div>

        <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
          <button 
            onClick={() => handleLike(currentVideo.id)}
            className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentVideo.liked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Icon name="Heart" size={24} className={currentVideo.liked ? 'fill-white text-white' : 'text-white'} />
            </div>
            <span className="text-xs text-white font-medium">{currentVideo.likes}</span>
          </button>

          <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="MessageCircle" size={24} className="text-white" />
            </div>
            <span className="text-xs text-white font-medium">{currentVideo.comments}</span>
          </button>

          <button 
            onClick={() => handleFavorite(currentVideo.id)}
            className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentVideo.favorited ? 'bg-accent' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Icon name="Star" size={24} className={currentVideo.favorited ? 'fill-accent-foreground text-accent-foreground' : 'text-white'} />
            </div>
            <span className="text-xs text-white font-medium">Сохранить</span>
          </button>

          <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="Share2" size={24} className="text-white" />
            </div>
            <span className="text-xs text-white font-medium">{currentVideo.shares}</span>
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-4 text-white/50">
          <button 
            onClick={() => handleScroll('up')}
            className={`transition-opacity ${currentVideoIndex === 0 ? 'opacity-30' : 'hover:opacity-100'}`}
            disabled={currentVideoIndex === 0}
          >
            <Icon name="ChevronUp" size={32} />
          </button>
          <button 
            onClick={() => handleScroll('down')}
            className={`transition-opacity ${currentVideoIndex === videos.length - 1 ? 'opacity-30' : 'hover:opacity-100'}`}
            disabled={currentVideoIndex === videos.length - 1}
          >
            <Icon name="ChevronDown" size={32} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="p-4 h-screen overflow-y-auto pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Поиск видео..." 
            className="pl-10 bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="aspect-[9/16] rounded-lg bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-border cursor-pointer hover:scale-105 transition-transform relative overflow-hidden group"
              onClick={() => {
                setCurrentTab('feed');
                setCurrentVideoIndex(videos.findIndex(v => v.id === video.id));
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                📹
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-xs text-white">
                  <Icon name="Heart" size={14} />
                  <span>{video.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => {
    const favoritedVideos = videos.filter(v => v.favorited);

    return (
      <div className="p-4 h-screen overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Избранное</h2>
          
          {favoritedVideos.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="Star" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет избранных видео</p>
              <p className="text-sm mt-2">Добавляйте видео в избранное, чтобы смотреть их позже</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {favoritedVideos.map((video) => (
                <div 
                  key={video.id}
                  className="aspect-[9/16] rounded-lg bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-accent/50 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                  onClick={() => {
                    setCurrentTab('feed');
                    setCurrentVideoIndex(videos.findIndex(v => v.id === video.id));
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    📹
                  </div>
                  <div className="absolute top-2 right-2">
                    <Icon name="Star" size={16} className="fill-accent text-accent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Icon name="Heart" size={14} />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="p-4 h-screen overflow-y-auto pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center gap-4 py-6">
          <GoldAvatar size="lg" />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Мой Профиль</h2>
            <p className="text-muted-foreground">@my_username</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-border">
          <div>
            <p className="text-2xl font-bold">{videos.length}</p>
            <p className="text-sm text-muted-foreground">Видео</p>
          </div>
          <div>
            <p className="text-2xl font-bold">12.5K</p>
            <p className="text-sm text-muted-foreground">Подписчики</p>
          </div>
          <div>
            <p className="text-2xl font-bold">342</p>
            <p className="text-sm text-muted-foreground">Подписки</p>
          </div>
        </div>

        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          onClick={() => setShowUploadDialog(true)}
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Загрузить видео
        </Button>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Мои видео</h3>
          <div className="grid grid-cols-3 gap-2">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="aspect-[9/16] rounded-lg bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-border cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                onClick={() => {
                  setCurrentTab('feed');
                  setCurrentVideoIndex(videos.findIndex(v => v.id === video.id));
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  📹
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-xs text-white">
                    <Icon name="Heart" size={14} />
                    <span>{video.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {currentTab === 'feed' && renderFeed()}
      {currentTab === 'search' && renderSearch()}
      {currentTab === 'favorites' && renderFavorites()}
      {currentTab === 'profile' && renderProfile()}

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
          <button 
            onClick={() => setCurrentTab('feed')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'feed' ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Icon name="Home" size={24} />
            <span className="text-xs font-medium">Лента</span>
          </button>

          <button 
            onClick={() => setCurrentTab('search')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'search' ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Icon name="Search" size={24} />
            <span className="text-xs font-medium">Поиск</span>
          </button>

          <button 
            onClick={() => setShowUploadDialog(true)}
            className="flex flex-col items-center gap-1 -mt-6"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-yellow-400 flex items-center justify-center shadow-lg shadow-accent/50">
              <Icon name="Plus" size={28} className="text-accent-foreground" />
            </div>
          </button>

          <button 
            onClick={() => setCurrentTab('favorites')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'favorites' ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Icon name="Star" size={24} />
            <span className="text-xs font-medium">Избранное</span>
          </button>

          <button 
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'profile' ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Icon name="User" size={24} />
            <span className="text-xs font-medium">Профиль</span>
          </button>
        </div>
      </nav>

      <Dialog open={showUploadDialog} onOpenChange={resetUploadDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Загрузить видео</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!videoPreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-accent transition-colors"
              >
                <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Нажмите или перетащите видео</p>
                <p className="text-xs text-muted-foreground mt-1">MP4, MOV до 100MB</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-[9/16] max-h-[400px] mx-auto rounded-lg overflow-hidden bg-black">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setVideoPreview(null);
                      setVideoFile(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Icon name="X" size={20} className="text-white" />
                  </button>
                </div>
                
                {videoFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="FileVideo" size={16} />
                    <span className="truncate flex-1">{videoFile.name}</span>
                    <span>{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                )}
              </div>
            )}
            
            {videoPreview && (
              <>
                <Textarea 
                  placeholder="Добавьте описание к видео..." 
                  className="bg-secondary border-border resize-none"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={3}
                />
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Загрузка...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="Upload" size={20} className="mr-2" />
                      Опубликовать
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;