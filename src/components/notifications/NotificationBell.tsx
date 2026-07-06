import { Bell, Check, Trash2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { items, unreadCount, markAllRead, markRead, remove } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground px-4">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              You're all caught up.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 group ${!n.read_at ? "bg-primary/5" : ""}`}
                  onMouseEnter={() => !n.read_at && markRead(n.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {n.type.startsWith("certificate") ? (
                        <Award className="h-4 w-4 text-primary" />
                      ) : (
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          {n.type === "certificate_approved" && (
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" asChild>
                              <Link to="/certificates">View</Link>
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
