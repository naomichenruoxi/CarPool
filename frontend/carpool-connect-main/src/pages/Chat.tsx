import { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import api from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Check, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
    id: string;
    name: string;
    email: string;
}

interface Message {
    id: number;
    content: string;
    senderId: string;
    createdAt: string;
    sender: { id: string; name: string };
}

interface Booking {
    id: number;
    status: string;
    tripId: number;
    trip: {
        id: number;
        origin: string;
        destination: string;
        date: string;
        driverId: string;
        driver: User;
    };
    passengerId: string;
    passenger: User;
    messages: Message[];
}

export default function Chat() {
    const { user } = useUser();
    const [conversations, setConversations] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedBooking) {
            fetchMessages(selectedBooking.id);
        }
    }, [selectedBooking]);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
            if (data.length > 0 && !selectedBooking) {
                // Automatically select first conversation if none selected? 
                // Or keep empty state. Let's keep empty state for now.
            }
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (bookingId: number) => {
        try {
            const { data } = await api.get(`/chat/booking/${bookingId}`);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedBooking || !user) return;

        setSending(true);
        try {
            const { data } = await api.post('/chat/messages', {
                bookingId: selectedBooking.id,
                content: newMessage
            });

            setMessages([...messages, { ...data, sender: { id: user.id, name: user.user_metadata.full_name || "Me" } }]);
            setNewMessage("");
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedBooking) return;

        console.log("Attempting status update:", {
            bookingId: selectedBooking.id,
            status,
            tripId: selectedBooking.trip.id
        });

        try {
            await api.patch(`/bookings/${selectedBooking.id}/status`, { status });
            toast.success(`Request ${status.toLowerCase()}`);

            // Update local state
            setSelectedBooking({ ...selectedBooking, status });
            setConversations(conversations.map(c => c.id === selectedBooking.id ? { ...c, status } : c));
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update status");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container py-8 h-[calc(100vh-64px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Sidebar: Conversations */}
                <Card className="md:col-span-1 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="px-4 pb-4 space-y-2">
                            {conversations.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No messages yet.</p>
                            ) : (
                                conversations.map((booking) => {
                                    const isDriver = user?.id === booking.trip.driverId;
                                    const otherUser = isDriver ? booking.passenger : booking.trip.driver;
                                    const lastMessage = booking.messages[0]?.content || "No messages";

                                    return (
                                        <div
                                            key={booking.id}
                                            onClick={() => setSelectedBooking(booking)}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedBooking?.id === booking.id ? "bg-muted" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            <Avatar>
                                                <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium truncate">{otherUser.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-2 capitalize"
                                                        style={{ color: booking.status === 'PENDING' ? 'orange' : booking.status === 'APPROVED' ? 'green' : 'red' }}>
                                                        {booking.status.toLowerCase()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{booking.trip.origin} → {booking.trip.destination}</p>
                                                <p className="text-sm text-muted-foreground truncate mt-1">{lastMessage}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Main Chat Area */}
                <Card className="md:col-span-2 h-full flex flex-col">
                    {selectedBooking ? (
                        <>
                            <CardHeader className="border-b py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {user?.id === selectedBooking.trip.driverId
                                                ? selectedBooking.passenger.name
                                                : selectedBooking.trip.driver.name}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Trip: {selectedBooking.trip.origin} to {selectedBooking.trip.destination}
                                        </p>
                                    </div>
                                    {/* Driver Actions */}
                                    {user?.id === selectedBooking.trip.driverId && selectedBooking.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate('REJECTED')}>
                                                <X className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusUpdate('APPROVED')}>
                                                <Check className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                        </div>
                                    )}
                                    {/* Show Status if not Pending */}
                                    {selectedBooking.status !== 'PENDING' && (
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${selectedBooking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedBooking.status}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t mt-auto">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    className="flex gap-2"
                                >
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={sending}
                                    />
                                    <Button type="submit" size="icon" disabled={sending}>
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select a conversation to start chatting
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
