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
  Switch,
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
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [archivedDialogOpen, setArchivedDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  
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

  // Fetch all users for dialogs
  const fetchAllUsers = async () => {
    try {
      // Try to fetch from online users first
      const response = await messengerService.getOnlineUsers();
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setAllUsers(response.data);
      } else {
        // If no online users, create mock data from current user
        console.log('No users found, you may need to add more users to the system');
        setAllUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setAllUsers([]);
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
    setNewChatDialogOpen(true);
    handleSettingsClose();
  };

  // Start conversation with selected user
  const handleStartConversation = async (userId) => {
    try {
      const response = await messengerService.createConversation(userId);
      
      if (response.success && response.data) {
        enqueueSnackbar('Conversation started successfully', { variant: 'success' });
        setNewChatDialogOpen(false);
        
        // Refresh conversations list
        await fetchConversations();
        
        // Select the new conversation if it was created
        if (response.data.id) {
          const newConv = conversations.find(c => c.id === response.data.id);
          if (newConv) {
            setSelectedConversation(newConv);
            fetchMessages(response.data.id);
          }
        }
      } else {
        enqueueSnackbar(response.message || 'Failed to start conversation', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      enqueueSnackbar('Failed to start conversation', { variant: 'error' });
    }
  };

  // Handle new group
  const handleNewGroup = () => {
    setNewGroupDialogOpen(true);
    setSelectedUsers([]);
    setGroupName('');
    handleSettingsClose();
  };

  // Create new group
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      enqueueSnackbar('Please enter a group name', { variant: 'warning' });
      return;
    }
    
    if (selectedUsers.length < 2) {
      enqueueSnackbar('Please select at least 2 members', { variant: 'warning' });
      return;
    }

    try {
      const response = await messengerService.createConversation(null, 'group', {
        name: groupName.trim(),
        participants: selectedUsers
      });
      
      if (response.success) {
        enqueueSnackbar('Group created successfully', { variant: 'success' });
        setNewGroupDialogOpen(false);
        setGroupName('');
        setSelectedUsers([]);
        await fetchConversations();
      } else {
        enqueueSnackbar(response.message || 'Failed to create group', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error creating group:', error);
      enqueueSnackbar('Failed to create group', { variant: 'error' });
    }
  };

  // Handle archived chats
  const handleArchivedChats = () => {
    setArchivedDialogOpen(true);
    handleSettingsClose();
  };

  // Toggle user selection for group
  const handleToggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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

  // Fetch users when dialogs open
  useEffect(() => {
    if (newChatDialogOpen || newGroupDialogOpen) {
      fetchAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChatDialogOpen, newGroupDialogOpen]);

  const filteredConversations = Array.isArray(conversations) ? conversations.filter(conv =>
    (conv.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.lastMessage || conv.last_message || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                      <IconButton size="small" onClick={handleNewChat}>
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
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Notifications
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Desktop Notifications</Typography>
                  <Switch
                    checked={desktopNotifications}
                    onChange={(e) => setDesktopNotifications(e.target.checked)}
                    color="primary"
                  />
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Privacy
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">Show Online Status</Typography>
                  <Switch
                    checked={showOnlineStatus}
                    onChange={(e) => setShowOnlineStatus(e.target.checked)}
                    color="primary"
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setSettingsOpen(false);
                enqueueSnackbar('Settings saved successfully', { variant: 'success' });
              }} 
              variant="contained"
            >
              Save
            </Button>
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

        {/* New Chat Dialog */}
        <Dialog open={newChatDialogOpen} onClose={() => setNewChatDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
              Select a user to start a conversation
            </Typography>
            
            {allUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Iconify icon="eva:people-outline" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No users available at the moment
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Make sure users exist in the system and are active
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {allUsers.map((user) => (
                  <ListItemButton
                    key={user.id}
                    onClick={() => handleStartConversation(user.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          user.status === 'online' ? (
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                border: 2,
                                borderColor: 'background.paper',
                              }}
                            />
                          ) : null
                        }
                      >
                        <Avatar src={user.avatar} alt={user.name} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewChatDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* New Group Dialog */}
        <Dialog open={newGroupDialogOpen} onClose={() => setNewGroupDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Select Members ({selectedUsers.length} selected)
                </Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  You need to select at least 2 members
                </Typography>
                
                {allUsers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Iconify icon="eva:people-outline" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No users available at the moment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Make sure users exist in the system and are active
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ maxHeight: 300, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, mt: 1 }}>
                    {allUsers.map((user) => (
                      <ListItemButton
                        key={user.id}
                        onClick={() => handleToggleUser(user.id)}
                        selected={selectedUsers.includes(user.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={user.email}
                        />
                        {selectedUsers.includes(user.id) && (
                          <Iconify icon="eva:checkmark-circle-2-fill" color="primary.main" width={24} />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewGroupDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup} 
              variant="contained"
              disabled={!groupName.trim() || selectedUsers.length < 2}
            >
              Create Group
            </Button>
          </DialogActions>
        </Dialog>

        {/* Archived Chats Dialog */}
        <Dialog open={archivedDialogOpen} onClose={() => setArchivedDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Archived Chats</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Iconify icon="eva:archive-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No archived chats
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Archive feature will be available soon
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArchivedDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Container>
    </>
  );
}