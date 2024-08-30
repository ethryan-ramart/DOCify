CREATE VIEW active_documents_with_usernames AS
SELECT d.*, p.username
FROM documents d
LEFT JOIN profiles p ON d.user_id = p.id
WHERE d.is_active = true;

-- const { data, error } = await supabase
    -- .from('active_documents_with_usernames')
    -- .select('*');