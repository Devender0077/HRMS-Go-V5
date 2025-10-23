import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
// @mui
import {
  Container,
  Card,
  Grid,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Stack,
  TextField,
  IconButton,
  Box,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import { getAvatar } from '../../utils/getAvatar';
// services
import messengerService from '../../services/messengerService';

// ----------------------------------------------------------------------

const MOCK_CONVERSATIONS = [
  { 
    id: 1, 
    name: 'John Doe', 
    lastMessage: 'Can we schedule a meeting?', 
    time: '10:30 AM', 
    unread: 2, 
    online: true,
    avatar: '/assets/images/avatars/avatar_1.jpg',
    type: 'direct'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    lastMessage: 'Thanks for the update!', 
    time: 'Yesterday', 
    unread: 0, 
    online: false,
    avatar: '/assets/images/avatars/avatar_2.jpg',
    type: 'direct'
  },
  { 
    id: 3, 
    name: 'HR Team', 
    lastMessage: 'Welcome to the HR team chat!', 
    time: 'Dec 18', 
    unread: 1, 
    online: true,
    avatar: '/assets/images/avatars/group_hr.jpg',
    type: 'group'
  },
];

const MOCK_MESSAGES = [
  { 
    id: 1, 
    sender: 'John Doe', 
    message: 'Hi, can we schedule a meeting for tomorrow?', 
    time: '10:25 AM', 
    isMe: false,
    type: 'text',
    avatar: '/assets/images/avatars/avatar_1.jpg'
  },
  { 
    id: 2, 
    sender: 'Me', 
    message: 'Sure! How about 2 PM?', 
    time: '10:27 AM', 
    isMe: true,
    type: 'text',
    avatar: '/assets/images/avatars/avatar_default.jpg'
  },
  { 
    id: 3, 
    sender: 'John Doe', 
    message: 'Perfect, see you then!', 
    time: '10:30 AM', 
    isMe: false,
    type: 'text',
    avatar: '/assets/images/avatars/avatar_1.jpg'
  },
];

// ----------------------------------------------------------------------

export default function MessengerPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  
  // State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // UI State
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messengerService.getConversations();
      if (response.success && Array.isArray(response.data)) {
        setConversations(response.data);
      } else {
        setConversations([]);
        enqueueSnackbar('No conversations found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
      enqueueSnackbar('Failed to load conversations', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const response = await messengerService.getMessages(conversationId);
      if (response.success && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]);
        enqueueSnackbar('No messages found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
      enqueueSnackbar('Failed to load messages', { variant: 'error' });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const response = await messengerService.getOnlineUsers();
      if (response.success && Array.isArray(response.data)) {
        setOnlineUsers(response.data);
      } else {
        setOnlineUsers([]);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
      setOnlineUsers([]);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const response = await messengerService.sendMessage(
        selectedConversation.id,
        messageText,
        'text'
      );

      if (response.success && response.data) {
        // Add the message to the list
        setMessages(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data]);
        
        // Update conversation list with new last message
        setConversations(prev => 
          Array.isArray(prev) ? prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { 
                  ...conv, 
                  lastMessage: messageText, 
                  time: 'Now',
                  lastMessageAt: new Date().toISOString()
                }
              : conv
          ) : []
        );

        enqueueSnackbar('Message sent successfully', { variant: 'success' });
      } else {
        // If API fails, still add to local state but show error
        const tempMessage = {
          id: Date.now(),
          content: messageText,
          type: 'text',
          created_at: new Date().toISOString(),
          sender_id: 1,
          sender_name: 'You',
          sender_avatar: '/assets/images/avatars/avatar_default.jpg',
          is_me: true
        };
        setMessages(prev => Array.isArray(prev) ? [...prev, tempMessage] : [tempMessage]);
        
        // Update conversation list
        setConversations(prev => 
          Array.isArray(prev) ? prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { 
                  ...conv, 
                  lastMessage: messageText, 
                  time: 'Now',
                  lastMessageAt: new Date().toISOString()
                }
              : conv
          ) : []
        );
        
        enqueueSnackbar('Message sent (offline mode)', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      enqueueSnackbar('Failed to send message', { variant: 'error' });
      setNewMessage(messageText); // Restore message on error
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Handle file attachment
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAttachmentDialogOpen(true);
    }
  };

  // Send file attachment
  const handleSendAttachment = async () => {
    if (!selectedFile || !selectedConversation) return;

    try {
      // In a real implementation, you would upload the file first
      // For now, we'll simulate sending a file message
      const fileMessage = {
        id: Date.now(),
        sender: 'Me',
        message: `📎 ${selectedFile.name}`,
        time: 'Now',
        isMe: true,
        type: 'file',
        avatar: '/assets/images/avatars/avatar_default.jpg',
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      };
      
      setMessages(prev => Array.isArray(prev) ? [...prev, fileMessage] : [fileMessage]);
      setAttachmentDialogOpen(false);
      setSelectedFile(null);
      
      enqueueSnackbar('File sent successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error sending attachment:', error);
      enqueueSnackbar('Failed to send attachment', { variant: 'error' });
    }
  };

  // Handle call
  const handleCall = (type) => {
    setCallDialogOpen(true);
    // In a real implementation, you would initiate a WebRTC call
    enqueueSnackbar(`${type} call initiated`, { variant: 'info' });
  };

  // Handle settings menu
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  // Handle new chat
  const handleNewChat = () => {
    // In a real implementation, you would open a dialog to select users
    enqueueSnackbar('New chat feature coming soon!', { variant: 'info' });
    handleSettingsClose();
  };

  // Handle new group
  const handleNewGroup = () => {
    // In a real implementation, you would open a dialog to create a group
    enqueueSnackbar('New group feature coming soon!', { variant: 'info' });
    handleSettingsClose();
  };

  // Handle archived chats
  const handleArchivedChats = () => {
    // In a real implementation, you would show archived conversations
    enqueueSnackbar('Archived chats feature coming soon!', { variant: 'info' });
    handleSettingsClose();
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await messengerService.searchConversations(query);
        if (response.success && Array.isArray(response.data)) {
          setConversations(response.data);
        }
      } catch (error) {
        console.error('Error searching conversations:', error);
      }
    } else {
      fetchConversations();
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
    fetchOnlineUsers();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = Array.isArray(conversations) ? conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <>
      <Helmet>
        <title> Messenger | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Messenger"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Messenger' },
          ]}
        />

        <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Conversations</Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="New Chat">
                      <IconButton size="small">
                        <Iconify icon="eva:plus-fill" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small" onClick={handleSettingsClick}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                
                {/* Search */}
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={{ mt: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Online Users */}
              {onlineUsers.length > 0 && (
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Online ({onlineUsers.length})
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                    {onlineUsers.slice(0, 5).map((user) => (
                      <Tooltip key={user.id} title={user.name}>
                        <Avatar
                          src={user.avatar}
                          sx={{ width: 32, height: 32, cursor: 'pointer' }}
                        />
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Conversations List */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : filteredConversations.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No conversations found
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredConversations.map((conversation) => (
                      <ListItemButton
                        key={conversation.id}
                        selected={selectedConversation?.id === conversation.id}
                        onClick={() => handleConversationSelect(conversation)}
                        sx={{ px: 2 }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              conversation.online ? (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'success.main',
                                    border: 2,
                                    borderColor: 'background.paper',
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Avatar
                              src={conversation.avatar}
                              alt={conversation.name}
                            />
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: 'text.primary',
                                  fontWeight: conversation.unread > 0 ? 600 : 400,
                                }}
                              >
                                {conversation.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {conversation.time}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  opacity: 0.8,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '70%',
                                }}
                              >
                                {conversation.lastMessage}
                              </Typography>
                              {conversation.unread > 0 && (
                                <Chip
                                  label={conversation.unread}
                                  size="small"
                                  color="primary"
                                  sx={{ minWidth: 20, height: 20, fontSize: '0.75rem' }}
                                />
                              )}
                            </Stack>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={selectedConversation.avatar}
                          alt={selectedConversation.name}
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.primary', fontWeight: 600 }}
                          >
                            {selectedConversation.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedConversation.online ? 'Online' : 'Offline'}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Voice Call">
                          <IconButton
                            size="small"
                            onClick={() => handleCall('Voice')}
                          >
                            <Iconify icon="eva:phone-fill" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Video Call">
                          <IconButton
                            size="small"
                            onClick={() => handleCall('Video')}
                          >
                            <Iconify icon="eva:video-fill" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                          <IconButton size="small">
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {messagesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : messages.length === 0 ? (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No messages yet. Start a conversation!
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {messages.map((message) => (
                          <Stack
                            key={message.id}
                            direction="row"
                            justifyContent={message.isMe ? 'flex-end' : 'flex-start'}
                            spacing={1}
                          >
                            {!message.isMe && (
                              <Avatar
                                src={message.avatar}
                                sx={{ width: 32, height: 32 }}
                              />
                            )}
                            <Paper
                              sx={{
                                p: 1.5,
                                maxWidth: '70%',
                                bgcolor: message.isMe ? 'primary.main' : 'background.neutral',
                                color: message.isMe ? 'white' : 'text.primary',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: message.isMe ? 'white' : 'text.primary',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {message.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: message.isMe ? 'white' : 'text.secondary',
                                  opacity: 0.7,
                                  display: 'block',
                                  mt: 0.5,
                                }}
                              >
                                {message.time}
                              </Typography>
                            </Paper>
                            {message.isMe && (
                              <Avatar
                                src={message.avatar}
                                sx={{ width: 32, height: 32 }}
                              />
                            )}
                          </Stack>
                        ))}
                        <div ref={messagesEndRef} />
                      </Stack>
                    )}
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                      <Tooltip title="Attach File">
                        <IconButton
                          size="small"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Iconify icon="eva:attach-2-fill" />
                        </IconButton>
                      </Tooltip>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        size="small"
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Iconify icon="eva:paper-plane-fill" />
                      </IconButton>
                    </Stack>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Box>
                    <Iconify icon="eva:message-circle-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Select a conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose a conversation from the list to start messaging
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Settings Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSettingsClose}
        >
          <MenuItem onClick={() => { setSettingsOpen(true); handleSettingsClose(); }}>
            <Iconify icon="eva:settings-2-fill" sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleNewChat}>
            <Iconify icon="eva:message-circle-fill" sx={{ mr: 1 }} />
            New Chat
          </MenuItem>
          <MenuItem onClick={handleNewGroup}>
            <Iconify icon="eva:people-fill" sx={{ mr: 1 }} />
            New Group
          </MenuItem>
          <MenuItem onClick={handleArchivedChats}>
            <Iconify icon="eva:archive-fill" sx={{ mr: 1 }} />
            Archived Chats
          </MenuItem>
        </Menu>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Messenger Settings</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Notifications
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Desktop Notifications</Typography>
                  <IconButton size="small">
                    <Iconify icon="eva:toggle-right-fill" />
                  </IconButton>
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Privacy
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Show Online Status</Typography>
                  <IconButton size="small">
                    <Iconify icon="eva:toggle-right-fill" />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Call Dialog */}
        <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)}>
          <DialogTitle>Incoming Call</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {selectedConversation?.name} is calling you...
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setCallDialogOpen(false)}>
              Decline
            </Button>
            <Button color="success" onClick={() => setCallDialogOpen(false)}>
              Accept
            </Button>
          </DialogActions>
        </Dialog>

        {/* Attachment Dialog */}
        <Dialog open={attachmentDialogOpen} onClose={() => setAttachmentDialogOpen(false)}>
          <DialogTitle>Send Attachment</DialogTitle>
          <DialogContent>
            {selectedFile && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  File: {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAttachmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendAttachment} variant="contained">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}